import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout/Layout";
import { Toaster } from "react-hot-toast";
import { Card, CardContent, Typography } from "@mui/material";

const Approved = () => {
  const [approvedItems, setApprovedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    const fetchShopAndApproved = async () => {
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

        // Fetch approved pre-invoices
        await fetchApproved(userShop.ID);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت اطلاعات فروشگاه یا پیش فاکتورها");
      }
    };

    fetchShopAndApproved();
  }, []);

  // const fetchApproved = async (shopId) => {
  //   try {
  //     setLoading(true);
  //     const { data } = await api.get(
  //       `/pre-invoices?status=approved&shop_id=${shopId}`
  //     );
  //     setApprovedItems(data.body?.preInvoices || []);
  //     setError(null);
  //   } catch (err) {
  //     console.error(err);
  //     setError("خطا در دریافت پیش فاکتورهای تایید شده");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const cardStyle = {
    mb: "12px",
    p: "16px 20px",
    backgroundColor: "#e6f7e6",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
  };

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />

      {loading && (
        <Typography>در حال بارگذاری پیش فاکتورهای تایید شده...</Typography>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && approvedItems.length === 0 && (
        <Typography>هیچ پیش فاکتور تایید شده‌ای وجود ندارد</Typography>
      )}

      {approvedItems.map((item) => (
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
            <Typography color="green" sx={{ mt: 1 }}>
              وضعیت: تایید شده ✅
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Layout>
  );
};

export default Approved;
