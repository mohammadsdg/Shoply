import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

function CuttersPreInvoices() {
  const [preInvoices, setPreInvoices] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({});

  const userId = localStorage.getItem("user_id");

  const fetchSections = async () => {
    try {
      const res = await api.get("/sections");
      if (res.data.success) setSections(res.data.body);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPreInvoices = async () => {
    try {
      const res = await api.get(`/cutters-preinvoice?cutter_id=${userId}`);
      const assignments = res.data.body || [];
      if (assignments.length === 0) {
        toast.error("هیچ پیش‌فاکتوری به شما اختصاص داده نشده است.");
        setLoading(false);
        return;
      }

      const groupId = assignments[0].pre_invoice_group_id;
      const groupRes = await api.get(`/preinvoice-groups/${groupId}`);
      if (groupRes.data.success)
        setPreInvoices(groupRes.data.body.members || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت پیش‌فاکتورها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchPreInvoices();
  }, []);

  const handleInputChange = (id, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSubmitFeedback = async (invoiceId) => {
    try {
      const feedback = inputs[invoiceId];
      if (!feedback?.weight) {
        toast.error("لطفاً وزن واقعی را وارد کنید");
        return;
      }

      const payload = {
        pre_invoice_id: invoiceId,
        actual_weight: Number(feedback.weight),
        actual_width: feedback.width ? Number(feedback.width) : null,
        actual_param_one: feedback.param_one
          ? Number(feedback.param_one)
          : null,
        notes: feedback.notes || null,
      };

      const res = await api.post("/cutter-feedback", payload);
      if (res.data.success) {
        toast.success("اندازه‌گیری‌ها با موفقیت ذخیره شد و فاکتور ایجاد شد");
        setInputs((prev) => ({ ...prev, [invoiceId]: {} }));
        await fetchPreInvoices(); // re-fetch from server to get fresh list
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "خطا در ذخیره اندازه‌گیری‌ها");
    }
  };

  const renderOriginalParams = (invoice) => {
    const section = sections.find((s) => s.ID === invoice.section_id);
    if (!section) return null;

    const elements = [];
    if (section.params >= 1)
      elements.push(
        <Typography key="param_one">
          <strong>{section.param_one}:</strong> {invoice.param_one}
        </Typography>,
      );
    if (section.params >= 2)
      elements.push(
        <Typography key="param_two">
          <strong>{section.param_two}:</strong> {invoice.param_two}
        </Typography>,
      );
    if (section.params === 3)
      elements.push(
        <Typography key="param_three">
          <strong>{section.param_three}:</strong> {invoice.param_three}
        </Typography>,
      );
    return elements;
  };

  if (loading) return <Typography>در حال بارگذاری...</Typography>;
  if (preInvoices.length === 0)
    return (
      <Typography>هیچ پیش‌فاکتوری به شما اختصاص داده نشده است.</Typography>
    );

  return (
    <Layout>
      <Toaster position="top-center" />
      <Typography variant="h5" sx={{ mb: 2 }}>
        پیش‌فاکتورهای اختصاصی شما
      </Typography>

      {preInvoices.map((invoice) => {
        const section = sections.find((s) => s.ID === invoice.section_id);
        const paramName = section?.param_one || "";

        return (
          <Card key={invoice.ID} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              {/* نمایش مقادیر اصلی */}
              <Typography>
                <strong>محصول:</strong> {section?.name || "نامشخص"} فولاد
              </Typography>
              <Typography>
                <strong>وزن:</strong> {invoice.weight} kg
              </Typography>
              <Typography>
                <strong>عرض:</strong> {invoice.width}
              </Typography>
              {renderOriginalParams(invoice)}

              {/* inputs برای مقادیر واقعی */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="وزن واقعی"
                  size="small"
                  type="number"
                  value={inputs[invoice.ID]?.weight || ""}
                  onChange={(e) =>
                    handleInputChange(invoice.ID, "weight", e.target.value)
                  }
                />
                <TextField
                  label="عرض واقعی"
                  size="small"
                  type="number"
                  value={inputs[invoice.ID]?.width || ""}
                  onChange={(e) =>
                    handleInputChange(invoice.ID, "width", e.target.value)
                  }
                />
                <TextField
                  label={`${paramName} واقعی`}
                  size="small"
                  type="number"
                  value={inputs[invoice.ID]?.param_one || ""}
                  onChange={(e) =>
                    handleInputChange(invoice.ID, "param_one", e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmitFeedback(invoice.ID)}
                >
                  ذخیره
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Layout>
  );
}

export default CuttersPreInvoices;
