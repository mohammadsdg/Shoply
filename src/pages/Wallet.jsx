import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

// ---- Helper: format numbers ----
const formatNumber = (num) => {
  if (num === null || num === undefined) return "-";
  // Remove decimals
  const integer = Math.floor(Number(num));
  // Add thousands separator
  const withCommas = integer.toLocaleString("en-US");
  // Convert to Persian digits
  const persianDigits = withCommas.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  return persianDigits;
};

function Wallet() {
  const userId = localStorage.getItem("user_id");

  // ---- State ----
  const [shopId, setShopId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ---- Load shops ----
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get("/shops");
      const shop = res.data.body.find(
        (item) => item.user_id === Number(userId)
      );
      if (shop) setShopId(shop.ID);
    } catch (err) {
      console.error(err);
      toast.error("خطا در بارگذاری فروشگاه‌ها");
    }
  };

  // ---- Load customers when shopId is available ----
  useEffect(() => {
    if (shopId) fetchCustomers();
  }, [shopId]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?shop_id=${shopId}`);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("خطا در بارگذاری مشتری‌ها");
    }
  };

  // ---- Load transactions when customer changes ----
  useEffect(() => {
    if (selectedCustomer) fetchTransactions(selectedCustomer);
  }, [selectedCustomer]);

  const fetchTransactions = async (customerId) => {
    try {
      setLoadingTransactions(true);
      const res = await api.get(`/wallets/${customerId}`);
      setTransactions(res.data.body || []);
      setLoadingTransactions(false);
    } catch (err) {
      console.error(err);
      setLoadingTransactions(false);
      toast.error("خطا در بارگذاری تراکنش‌ها");
    }
  };

  // ---- Submit transaction ----
  const handleSubmit = async () => {
    if (!selectedCustomer || !transactionType || !amount || !manualDate) {
      toast.error("لطفا همه فیلدها را پر کنید");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/wallets", {
        customer_id: selectedCustomer,
        transaction_type: Number(transactionType),
        amount: Math.floor(Number(amount)), // remove decimals
        manual_date: manualDate,
      });

      // Refresh transactions after successful submission
      fetchTransactions(selectedCustomer);

      // Clear form
      setTransactionType("");
      setAmount("");
      setManualDate("");

      toast.success("تراکنش با موفقیت ثبت شد!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "خطا در ثبت تراکنش");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hot Toast container */}
      <Toaster reverseOrder={false} />

      {/* ----- Top Form ----- */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          p: 2,
          mb: 2,
          bgcolor: "#f0f0f0",
          borderRadius: 2,
          alignItems: "center",
        }}
      >
        {/* Customer Select */}
        <FormControl sx={{ flex: "1 1 140px", minWidth: 140 }}>
          <InputLabel>مشتری</InputLabel>
          <Select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Transaction Type */}
        <FormControl sx={{ flex: "1 1 140px", minWidth: 140 }}>
          <InputLabel>نوع تراکنش</InputLabel>
          <Select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <MenuItem value={1}>واریز</MenuItem>
            <MenuItem value={2}>برداشت</MenuItem>
          </Select>
        </FormControl>

        {/* Amount */}
        <TextField
          type="number"
          label="مبلغ"
          sx={{ flex: "1 1 140px", minWidth: 140 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Manual Date */}
        <TextField
          label="تاریخ (شمسی)"
          placeholder="1404-10-16"
          sx={{ flex: "1 1 140px", minWidth: 140 }}
          value={manualDate}
          onChange={(e) => setManualDate(e.target.value)}
        />

        {/* Submit */}
        <Button
          variant="contained"
          sx={{
            flex: "1 1 120px",
            minWidth: 120,
            backgroundColor: "#F9471F",
            height: "100%",
          }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "در حال ثبت..." : "ثبت"}
        </Button>
      </Box>

      {/* ----- Modern Transactions Table ----- */}
      {loadingTransactions ? (
        <Box sx={{ textAlign: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Typography sx={{ p: 2, textAlign: "center", color: "#555" }}>
          تراکنشی وجود ندارد
        </Typography>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            p: 2,
            borderRadius: 3,
            bgcolor: "#ffffff",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
          >
            <TableHead>
              <TableRow
                sx={{ bgcolor: "#F9471F", borderRadius: 3, height: 50 }}
              >
                {["تاریخ", "نوع تراکنش", "مبلغ", "مانده"].map((header, idx) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      textAlign: "left",
                      borderTopLeftRadius: idx === 0 ? 10 : 0,
                      borderBottomLeftRadius: idx === 0 ? 10 : 0,
                      borderTopRightRadius: idx === 3 ? 10 : 0,
                      borderBottomRightRadius: idx === 3 ? 10 : 0,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {transactions.map((t, i) => (
                <TableRow
                  key={t.id}
                  sx={{
                    bgcolor: i % 2 === 0 ? "#fdfdfd" : "#f7f7f7", // subtle striped rows
                    "&:hover": {
                      bgcolor: t.transaction_type === 1 ? "#e0f7e9" : "#ffe5e3",
                    },
                    borderRadius: 2,
                    transition: "all 0.25s ease",
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, textAlign: "left" }}>
                    {t.manual_date}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: t.transaction_type === 1 ? "#4caf50" : "#f44336",
                      textAlign: "left",
                    }}
                  >
                    {t.transaction_type === 1 ? "واریز" : "برداشت"}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, textAlign: "left" }}>
                    {formatNumber(t.amount)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, textAlign: "left" }}>
                    {formatNumber(t.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Layout>
  );
}

export default Wallet;
