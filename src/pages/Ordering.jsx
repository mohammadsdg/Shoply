import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import {
  Container,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import api from "../api";

function Ordering() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [order, setOrder] = useState({
    number: "",
    width: "",
    total_width: "",
    product_size_id: "",
    code: "",
  });

  useEffect(() => {
    fetchUserShop();
  }, []);

  // ✅ Fetch user's shop
  const fetchUserShop = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("کاربر یافت نشد. لطفاً وارد شوید.");
        return;
      }

      const res = await api.get("/shops");
      const shops = res.data.body || [];
      const userShop = shops.find((s) => s.user_id === Number(userId));

      if (userShop) {
        setShopId(userShop.ID);
        fetchStock(userShop.ID);
      } else {
        toast.error("هیچ فروشگاهی برای این کاربر یافت نشد.");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت اطلاعات فروشگاه");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch available stock items
  const fetchStock = async (shopId) => {
    try {
      const res = await api.get(`/stock-items?shop_id=${shopId}`);
      const items = res.data.body;
      setStockItems(items);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت محصولات انبار");
    }
  };

  // ✅ Open order modal
  const openOrderModal = (item) => {
    setSelectedItem(item);
    setOrder({
      number: "",
      width: "",
      total_width: item.width || "",
      product_size_id: item.product_size_id || "",
      code: item.code || "",
    });
    setOpen(true);
  };

  // ✅ Handle input change
  const onOrderChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit order → calls /stock-items API
  const handleOrderSubmit = async () => {
    const { number, width, total_width, product_size_id, code } = order;

    if (!number || !width || !total_width || !product_size_id) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      return;
    }

    try {
      const payload = {
        total_width: Number(total_width),
        width: Number(width),
        number: Number(number),
        product_size_id: Number(product_size_id),
        ID: selectedItem.ID,
        code: code || undefined,
      };

      const res = await api.post("/stock-items", payload);

      if (res.data.success) {
        toast.success("سفارش با موفقیت ثبت شد");
        setOpen(false);
        fetchStock(shopId);
      } else {
        toast.error(res.data.message || "خطا در ثبت سفارش");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارسال سفارش به سرور");
    }
  };

  // ✅ Modal styles
  const modalBox = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          سفارش محصولات
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>شناسه</TableCell>
                <TableCell>شناسه سایز محصول</TableCell>
                <TableCell>طول باقی‌مانده (میلی‌متر)</TableCell>
                <TableCell>وزن (کیلوگرم)</TableCell>
                <TableCell>قیمت</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    در حال بارگذاری...
                  </TableCell>
                </TableRow>
              ) : stockItems.length > 0 ? (
                stockItems.map((item) => (
                  <TableRow key={item.ID}>
                    <TableCell>{item.ID}</TableCell>
                    <TableCell>{item.product_size_id}</TableCell>
                    <TableCell>{parseFloat(item.width)} میلی‌متر</TableCell>
                    <TableCell>{parseFloat(item.weight)}</TableCell>
                    <TableCell>{parseFloat(item.price)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => openOrderModal(item)}
                      >
                        سفارش‌گذاری
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    هیچ محصولی یافت نشد
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* 🧾 Modal for ordering */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalBox}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            سفارش‌گذاری برای محصول {selectedItem?.section_name || ""}
          </Typography>

          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.100",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              طول کل:
            </Typography>
            <Typography
              variant="body1"
              color="#F9471F"
              sx={{ fontWeight: 600 }}
            >
              {parseFloat(order.total_width)} میلی‌متر
            </Typography>
          </Box>

          <TextField
            name="width"
            label="طول مورد سفارش (میلی‌متر)"
            type="number"
            fullWidth
            value={order.width}
            onChange={onOrderChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="number"
            label="تعداد"
            type="number"
            fullWidth
            value={order.number}
            onChange={onOrderChange}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleOrderSubmit}>
            ثبت سفارش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Ordering;
