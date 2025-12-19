import React, { useEffect, useMemo, useState, useRef } from "react";
import Layout from "../components/Layout/Layout";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Modal,
  CircularProgress,
  Paper,
  Checkbox,
  Divider,
  Chip,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import api from "../api";
import { useReactToPrint } from "react-to-print";

// --- ابزارهای کمکی (Utilities) ---
const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed === 0) return "۰ ریال";
  return `${parsed.toLocaleString("fa-IR")} ریال`;
};

const formatWeight = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  return `${parsed.toLocaleString("fa-IR")} کیلوگرم`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("fa-IR");
};

const buildDescription = (invoice, shopProducts) => {
  const product = shopProducts.find((p) => p.ID === invoice.shop_products_id);
  if (product) {
    return `${product.section_name} ${product.material_name} ${product.alloy_name}`;
  }
  return invoice.manual_brand_name || "کالای متفرقه";
};

const buildInvoiceTotals = (invoice) => {
  const pricePerWeight = toNumber(invoice?.selling_price || invoice?.price);
  const totalWeight = toNumber(invoice?.total_weight || invoice?.weight);
  const productTotal = pricePerWeight * totalWeight;
  const piecesCount = toNumber(invoice?.number) || 0;
  const cuttingTotal = toNumber(invoice?.cutting_price) * piecesCount;
  const transportationTotal =
    toNumber(invoice?.transportation_price) * piecesCount;
  const grandTotal = productTotal + cuttingTotal + transportationTotal;

  return {
    pricePerWeight,
    totalWeight,
    productTotal,
    cuttingTotal,
    transportationTotal,
    piecesCount,
    grandTotal,
  };
};

// --- زیرمجموعه‌های بصری ---

const PartyCard = ({ title, info }) => (
  <Paper
    sx={{ p: 2, flex: 1, minWidth: 220, bgcolor: "grey.50" }}
    variant="outlined"
  >
    <Typography
      variant="subtitle2"
      sx={{ mb: 1, fontWeight: 700, color: "primary.main" }}
    >
      {title}
    </Typography>
    <Typography variant="body2">
      <b>نام:</b> {info?.name || "-"}
    </Typography>
    <Typography variant="body2">
      <b>تلفن:</b> {info?.mobile || "-"}
    </Typography>
  </Paper>
);

const renderInvoiceRows = (invoice, shopProducts, startIndex = 1) => {
  const totals = buildInvoiceTotals(invoice);
  const description = buildDescription(invoice, shopProducts);

  return [
    <TableRow key={`${invoice.ID}-product`}>
      <TableCell>{startIndex}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>{formatCurrency(totals.pricePerWeight)}</TableCell>
      <TableCell>{formatWeight(totals.totalWeight)}</TableCell>
      <TableCell>{formatCurrency(totals.productTotal)}</TableCell>
    </TableRow>,
    <TableRow key={`${invoice.ID}-cutting`}>
      <TableCell>{startIndex + 1}</TableCell>
      <TableCell>هزینه برشکاری</TableCell>
      <TableCell>{formatCurrency(invoice.cutting_price)}</TableCell>
      <TableCell>{totals.piecesCount.toLocaleString("fa-IR")} عدد</TableCell>
      <TableCell>{formatCurrency(totals.cuttingTotal)}</TableCell>
    </TableRow>,
    <TableRow key={`${invoice.ID}-loading`}>
      <TableCell>{startIndex + 2}</TableCell>
      <TableCell>هزینه بارگیری و حمل</TableCell>
      <TableCell>{formatCurrency(invoice.transportation_price)}</TableCell>
      <TableCell>{totals.piecesCount.toLocaleString("fa-IR")} عدد</TableCell>
      <TableCell>{formatCurrency(totals.transportationTotal)}</TableCell>
    </TableRow>,
  ];
};

const GroupView = ({ members, shopProducts }) => {
  const grandTotalAll = members.reduce(
    (sum, inv) => sum + buildInvoiceTotals(inv).grandTotal,
    0
  );
  const firstInv = members[0];

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
      >
        فاکتور تجمیعی نهایی
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <PartyCard title="مشخصات فروشنده" info={firstInv?.seller_info} />
        <PartyCard title="مشخصات خریدار" info={firstInv?.buyer_info} />
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell>ردیف</TableCell>
              <TableCell>شرح کالا / خدمات</TableCell>
              <TableCell>قیمت واحد</TableCell>
              <TableCell>مقدار / تعداد</TableCell>
              <TableCell>جمع کل</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((inv, idx) =>
              renderInvoiceRows(inv, shopProducts, idx * 3 + 1)
            )}
            <TableRow sx={{ bgcolor: "primary.light" }}>
              <TableCell colSpan={4} sx={{ fontWeight: 800, color: "white" }}>
                جمع کل کل فاکتور:
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "white" }}>
                {formatCurrency(grandTotalAll)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const InvoiceDetailView = ({
  currentInvoice,
  allInvoices,
  shopProducts,
  onSwitch,
}) => {
  const customerInvoices = allInvoices.filter(
    (inv) =>
      inv.customer_name === currentInvoice.customer_name &&
      inv.ID !== currentInvoice.ID
  );

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">پیش‌فاکتور #{currentInvoice.ID}</Typography>
        <Chip
          label={`مشتری: ${currentInvoice.customer_name}`}
          color="secondary"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <PartyCard title="فروشنده" info={currentInvoice?.seller_info} />
        <PartyCard title="خریدار" info={currentInvoice?.buyer_info} />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table size="small">
          <TableBody>
            {renderInvoiceRows(currentInvoice, shopProducts, 1)}
          </TableBody>
        </Table>
      </TableContainer>

      {/* بخش سوییچ بین فاکتورها در چاپ مخفی می‌شود (اختیاری) */}
      <Box className="no-print">
        {customerInvoices.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="subtitle2"
              sx={{ mb: 1.5, fontWeight: "bold" }}
            >
              سایر پیش‌فاکتورهای ثبت شده برای این مشتری:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {customerInvoices.map((inv) => (
                <Button
                  key={inv.ID}
                  variant="outlined"
                  size="small"
                  onClick={() => onSwitch(inv)}
                >
                  مشاهده #{inv.ID} ({buildDescription(inv, shopProducts)})
                </Button>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

// --- کامپوننت اصلی ---
function PreInvoices() {
  const [preInvoices, setPreInvoices] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [modalContext, setModalContext] = useState(null);

  // ۱. ایجاد ریفرنس برای محتوای چاپ
  const printRef = useRef(null);

  // ۲. تعریف تابع چاپ
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `فاکتور_${modalContext?.invoice?.ID || "تجمیعی"}`,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const userId = Number(localStorage.getItem("user_id"));
      const [shopsRes, productsRes] = await Promise.all([
        api.get("/shops"),
        api.get("/shop-products"),
      ]);

      const userShop = shopsRes.data.body?.find(
        (s) => Number(s.user_id) === userId
      );
      setShopProducts(productsRes.data.body || []);

      if (userShop) {
        setShopId(userShop.ID);
        const [invRes, groupsRes] = await Promise.all([
          api.get(`/preinvoices?shop_id=${userShop.ID}`),
          api.get(`/preinvoice-groups?shop_id=${userShop.ID}`),
        ]);
        setPreInvoices(invRes.data.body || []);
        setGroups(groupsRes.data.body || []);
      }
    } catch (err) {
      toast.error("خطا در بارگذاری داده‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleAggregatedAction = async () => {
    if (selectedInvoices.length < 2) {
      toast.error("حداقل دو مورد انتخاب کنید");
      return;
    }

    const selectedData = preInvoices.filter((inv) =>
      selectedInvoices.includes(inv.ID)
    );
    const firstCustomer = selectedData[0].customer_name;
    const isSameCustomer = selectedData.every(
      (inv) => inv.customer_name === firstCustomer
    );

    if (!isSameCustomer) {
      toast.error("تجمیع فقط برای پیش‌فاکتورهای یک مشتری واحد امکان‌پذیر است");
      return;
    }

    try {
      const res = await api.post("/preinvoice-groups", {
        pre_invoice_ids: selectedInvoices,
      });
      toast.success("فاکتور تجمیعی ساخته شد");
      setSelectedInvoices([]);
      fetchInitialData();
      setModalContext({ type: "group", members: res.data.body.members });
    } catch (err) {
      toast.error("خطا در تجمیع");
    }
  };

  return (
    <Layout>
      <Toaster position="top-center" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            مدیریت پیش‌فاکتورها
          </Typography>
          <Button
            variant="contained"
            disabled={selectedInvoices.length < 2}
            onClick={handleAggregatedAction}
          >
            تجمیع موارد انتخاب شده ({selectedInvoices.length})
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 5 }}>
          <Table>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>شناسه</TableCell>
                <TableCell>نام مشتری</TableCell>
                <TableCell>شرح کالا</TableCell>
                <TableCell>تاریخ</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} sx={{ mt: 1 }} />
                  </TableCell>
                </TableRow>
              ) : (
                preInvoices.map((inv) => (
                  <TableRow key={inv.ID} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedInvoices.includes(inv.ID)}
                        onChange={() =>
                          setSelectedInvoices((prev) =>
                            prev.includes(inv.ID)
                              ? prev.filter((id) => id !== inv.ID)
                              : [...prev, inv.ID]
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{inv.ID}</TableCell>
                    <TableCell>
                      <b>{inv.customer_name}</b>
                    </TableCell>
                    <TableCell>{buildDescription(inv, shopProducts)}</TableCell>
                    <TableCell>{formatDate(inv.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          setModalContext({ type: "invoice", invoice: inv })
                        }
                      >
                        مشاهده
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" sx={{ mb: 2 }}>
          لیست فاکتورهای تجمیعی
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell>شناسه گروه</TableCell>
                <TableCell>تعداد آیتم</TableCell>
                <TableCell>تاریخ</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((g) => (
                <TableRow key={g.ID}>
                  <TableCell>{g.ID}</TableCell>
                  <TableCell>{g.members_count} مورد</TableCell>
                  <TableCell>{formatDate(g.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={async () => {
                        const res = await api.get(`/preinvoice-groups/${g.ID}`);
                        setModalContext({
                          type: "group",
                          members: res.data.body.members,
                        });
                      }}
                    >
                      مشاهده تجمیعی
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Modal open={Boolean(modalContext)} onClose={() => setModalContext(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(1100px, 95vw)",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          {/* ۳. محتوای مودال را داخل این div قرار دادیم تا قابل چاپ باشد */}
          <div ref={printRef} style={{ direction: "rtl", padding: "10px" }}>
            {modalContext?.type === "group" ? (
              <GroupView
                members={modalContext.members}
                shopProducts={shopProducts}
              />
            ) : (
              <InvoiceDetailView
                currentInvoice={modalContext?.invoice}
                allInvoices={preInvoices}
                shopProducts={shopProducts}
                onSwitch={(newInv) =>
                  setModalContext({ type: "invoice", invoice: newInv })
                }
              />
            )}
          </div>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => setModalContext(null)}
            >
              بستن
            </Button>
            {/* ۴. اضافه کردن دکمه چاپ */}
            <Button variant="contained" color="success" onClick={handlePrint}>
              چاپ فاکتور
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* استایل اختیاری برای مخفی کردن دکمه‌ها در هنگام چاپ واقعی */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
          }
        `}
      </style>
    </Layout>
  );
}

export default PreInvoices;
