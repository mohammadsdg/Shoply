import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout/Layout";
import { Toaster } from "react-hot-toast";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import toast from "react-hot-toast";

const Pending = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopId, setShopId] = useState(null);

  // Fetch user's shop and then pending pre-invoices
  useEffect(() => {
    const fetchShopAndPendings = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setError("کاربر یافت نشد. لطفاً وارد شوید.");
          return;
        }

        // Fetch user's shop
        const shopRes = await api.get("/shops");
        const shops = shopRes.data.body || [];
        const userShop = shops.find((s) => s.user_id === Number(userId));
        if (!userShop) {
          setError("هیچ فروشگاهی برای این کاربر یافت نشد.");
          return;
        }
        setShopId(userShop.ID);

        // Fetch pending pre-invoices
        await fetchPendings(userShop.ID);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت اطلاعات فروشگاه یا پیش فاکتورها");
      }
    };

    fetchShopAndPendings();
  }, []);

  const fetchPendings = async (shopId) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/pre-invoices?status=pending&shop_id=${shopId}`
      );
      setPendingItems(data.body?.preInvoices || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت پیش فاکتورها");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/pre-invoices/${id}`, { status: "approved" });
      toast.success("پیش فاکتور تایید شد ✅");
      fetchPendings(shopId); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("خطا در تایید پیش فاکتور");
    }
  };

  const cardStyle = {
    mb: "12px",
    p: "16px 20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
  };

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />

      {loading && <Typography>در حال بارگذاری پیش فاکتورها...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && pendingItems.length === 0 && (
        <Typography>هیچ پیش فاکتوری در انتظار نیست</Typography>
      )}

      {pendingItems.map((item) => (
        <Card key={item.ID} sx={cardStyle}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Typography>
              <strong>ID:</strong> #{item.ID}
            </Typography>
            <Typography>
              <strong>نام فرد:</strong> {item.customer_name}
            </Typography>
            <Typography>
              <strong>شماره:</strong> {item.number}
            </Typography>
            <Typography>
              <strong>قیمت:</strong> {item.price.toLocaleString()} تومان
            </Typography>
            <Typography>
              <strong>عرض:</strong> {item.width}
            </Typography>
            <Typography>
              <strong>وزن:</strong> {item.weight}
            </Typography>
            <Typography>
              <strong>کد محصول:</strong> {item.stock_item_id}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => handleApprove(item.ID)}
              >
                تایید پیش فاکتور
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Layout>
  );
};

export default Pending;
