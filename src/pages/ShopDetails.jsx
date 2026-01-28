import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Modal,
  TextField,
  Skeleton,
  Select,
  MenuItem,
} from "@mui/material";
import { Circle, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api";
import _ from "lodash";
import { computeCircleArea } from "../utils/sectionMath";

function ShopDetails() {
  const { shopId } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [shopName, setShopName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedShopProductId, setSelectedShopProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [weightLocked, setWeightLocked] = useState(false);
  const [didUserChangeWeightManually, setDidUserChangeWeightManually] =
    useState(false);

  const materialsSpecialWeights = {
    فولاد: 7.85,
    الومینیوم: 2.7,
    آلومینیوم: 2.7,
    استیل: 8,
    مس: 8.5,
    پلیمر: 2,
  };

  // Form fields
  const [formData, setFormData] = useState({
    param_one: "",
    param_two: "",
    param_three: "",
    width: "",
    number: "",
    weight: "",
    price: "",
    totalWeight: "",
    specialWeight: "",
  });

  // ------------------------------------------------------------
  // FETCH CUSTOMERS — FIXED
  // ------------------------------------------------------------
  const fetchAllCurrentShopCustomers = async () => {
    try {
      const res = await api.get(`/customers?shop_id=${shopId}`);
      setCustomers(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("مشکلی پیش امد");
    }
  };

  useEffect(() => {
    fetchAllCurrentShopCustomers();
  }, []);

  // ------------------------------------------------------------
  // FETCH OTHER DATA
  // ------------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        setRole(localStorage.getItem("role"));
        await Promise.all([
          fetchShopName(),
          fetchShopProducts(),
          fetchAllProducts(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [shopId]);

  const fetchShopName = async () => {
    try {
      const res = await api.get("/shops");
      const shops = res.data.body || [];
      const shop = shops.find((s) => s.ID === Number(shopId));
      setShopName(shop ? shop.name : "");
    } catch (err) {
      toast.error("خطا در دریافت اطلاعات فروشگاه");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await api.get("/products");
      setAllProducts(res.data.body || []);
    } catch (err) {
      toast.error("خطا در دریافت همه محصولات");
    }
  };

  const fetchShopProducts = async () => {
    try {
      const res = await api.get(`/shop-products/${shopId}`);
      setShopProducts(res.data.body || []);
    } catch {
      toast.error("خطا در دریافت محصولات فروشگاه");
    }
  };

  // ------------------------------------------------------------
  // OPEN MODAL + RESET
  // ------------------------------------------------------------
  const handleAddSizing = (product) => {
    setSelectedShopProductId(product.shopProductId ?? null);
    setSelectedProduct(product);

    setDidUserChangeWeightManually(false);

    setFormData({
      param_one: "",
      param_two: "",
      param_three: "",
      width: "",
      number: "",
      weight: "",
      price: "",
      totalWeight: "",
      specialWeight: materialsSpecialWeights[product?.materialName],
    });

    setOpen(true);
  };

  // ------------------------------------------------------------
  // LABELS
  // ------------------------------------------------------------
  const fieldLabels = {
    width: "طول",
    number: "تعداد",
    weight: "وزن",
    price: "قیمت",
    specialWeight: "وزن مخصوص",
    totalWeight: "وزن کلی",
  };

  const handleCustomerSelectChange = (e) => {
    setCurrentUser(e.target.value);
  };

  const getFieldsBySection = (sectionName) => {
    switch (sectionName) {
      case "گرد":
        return [{ name: "param_one", label: "قطر" }];
      case "ورق":
        return [
          { name: "param_one", label: "ضخامت" },
          { name: "param_two", label: "عرض" },
        ];
      case "لوله":
        return [
          { name: "param_one", label: "قطر خارجی" },
          { name: "param_two", label: "قطر داخلی" },
        ];
      case "تسمه":
        return [
          { name: "param_one", label: "ضخامت" },
          { name: "param_two", label: "عرض" },
        ];
      case "شش پر":
        return [{ name: "param_one", label: "آچارخور" }];
      default:
        return [];
    }
  };

  // ------------------------------------------------------------
  // CALCULATIONS (unchanged)
  // ------------------------------------------------------------
  const isCircle = selectedProduct?.sectionName === "گرد";

  useEffect(() => {
    if (!didUserChangeWeightManually) return;
    const weight = parseFloat(formData.weight);
    const number = parseFloat(formData.number) || 1;
    const width = parseFloat(formData.width);

    const area = (width * width * 3.14) / 4000000;

    if (isNaN(weight) || weight <= 0) return;

    setFormData((prev) => {
      const newSpecialWeight = (weight / (area * width)).toFixed(2);
      if (prev.specialWeight === newSpecialWeight) return prev;
      return { ...prev, specialWeight: newSpecialWeight };
    });
  }, [formData.weight, formData.number, didUserChangeWeightManually]);

  useEffect(() => {
    const w = parseFloat(formData.weight);
    const n = parseFloat(formData.number);

    const newTotal = !isNaN(w) && !isNaN(n) ? (w * n).toFixed(2) : "";

    setFormData((prev) => {
      if (prev.totalWeight === newTotal) return prev;
      return { ...prev, totalWeight: newTotal };
    });
  }, [formData.weight, formData.number]);

  useEffect(() => {
    if (!isCircle) return;

    const diameter = parseFloat(formData.param_one);
    const width = parseFloat(formData.width);

    if (!diameter || !width) {
      setFormData((prev) => ({ ...prev, weight: "" }));
      return;
    }

    const baseSpecial = materialsSpecialWeights[selectedProduct?.materialName];
    const area = computeCircleArea(diameter);
    const newWeight = (baseSpecial * width * area).toFixed(3);

    setFormData((prev) => {
      if (prev.weight === newWeight) return prev;
      return { ...prev, weight: newWeight };
    });
  }, [formData.param_one, formData.width, isCircle]);

  const handleWeightChange = (value) => {
    setDidUserChangeWeightManually(true);
    setFormData((prev) => ({
      ...prev,
      weight: value,
    }));
  };

  // ------------------------------------------------------------
  // SAVE
  // ------------------------------------------------------------
  const handleSaveSizing = async () => {
    try {
      const payload = {
        shop_products_id: selectedShopProductId,
        param_one: formData.param_one || null,
        param_two: formData.param_two || null,
        param_three: formData.param_three || null,
        width: formData.width || null,
        number: formData.number || null,
        weight: formData.weight || null,
        price: formData.price || null,
        special_weight: formData.specialWeight,
        total_weight: formData.totalWeight,
        section_id: selectedProduct?.section_id ?? null,
        customer_id: currentUser || null,
      };

      await api.post("/products-size", payload);
      toast.success("سایزبندی با موفقیت ذخیره شد");
      setOpen(false);
    } catch {
      toast.error("خطا در ذخیره سایزبندی");
    }
  };

  // ------------------------------------------------------------
  // PRODUCT TOGGLE
  // ------------------------------------------------------------
  const handleToggleProduct = async (productId, isInShop) => {
    try {
      if (isInShop) {
        const sp = shopProducts.find((p) => p.product_id === productId);
        if (sp) await api.delete(`/shop-products/${sp.ID}`);
        toast.success("محصول از فروشگاه حذف شد");
      } else {
        await api.post("/shop-products", {
          shop_id: shopId,
          product_id: productId,
        });
        toast.success("محصول به فروشگاه اضافه شد");
      }
      fetchShopProducts();
    } catch {
      toast.error("مشکلی پیش آمد");
    }
  };

  // ------------------------------------------------------------
  // SORTING
  // ------------------------------------------------------------
  const shopProductIds = new Set(shopProducts.map((p) => p.product_id));
  const sortedProducts = _.sortBy(allProducts, (p) =>
    shopProductIds.has(p.ID) ? 0 : 1
  );

  const shopProductsWithDetails = shopProducts.map((sp) => {
    const product = allProducts.find((p) => p.ID === sp.product_id) || {};
    return {
      ...product,
      shopProductId: sp.ID,
      shopProduct: sp,
      section_id: sp.section_id ?? product.section_id,
    };
  });

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  const modalBox = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  const renderSkeletons = (count = 5) =>
    Array.from({ length: count }).map((_, i) => (
      <Card key={i} sx={{ mb: 2 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </CardContent>
      </Card>
    ));

  return (
    <Layout>
      <Toaster position="top-center" />

      {loading ? (
        <>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            <Skeleton width="50%" />
          </Typography>
          {renderSkeletons(6)}
        </>
      ) : shopName === "" ? (
        <h1>هیچ فروشگاهی پیدا نشد</h1>
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            مدیریت محصولات فروشگاه {shopName || shopId}
          </Typography>

          {role === "super-admin" &&
            sortedProducts.map((product) => {
              const isInShop = shopProductIds.has(product.ID);
              return (
                <Card key={product.ID} sx={{ mb: 2 }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{product.alloyName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.sectionName} | {product.materialName} |{" "}
                        {product.brandName}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={() => handleToggleProduct(product.ID, isInShop)}
                    >
                      {isInShop ? (
                        <CheckCircle color="green" />
                      ) : (
                        <Circle color="gray" />
                      )}
                    </IconButton>
                  </CardContent>
                </Card>
              );
            })}

          {role === "shop-admin" &&
            shopProductsWithDetails.map((product) => (
              <Card key={product.shopProductId} sx={{ mb: 2 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6">{product.alloyName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.sectionName} | {product.materialName} |{" "}
                      {product.brandName}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleAddSizing(product)}
                  >
                    سایزبندی
                  </Button>
                </CardContent>
              </Card>
            ))}
        </>
      )}

      {/* ---------------------- MODAL ---------------------- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            سایزبندی جدید
          </Typography>

          {selectedProduct &&
            getFieldsBySection(selectedProduct.sectionName).map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                fullWidth
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                sx={{ mb: 2 }}
              />
            ))}

          {[
            "width",
            "weight",
            "price",
            "number",
            "totalWeight",
            "specialWeight",
          ].map((field) => (
            <TextField
              key={field}
              label={fieldLabels[field]}
              fullWidth
              value={formData[field] ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                if (field === "weight") {
                  handleWeightChange(value);
                  return;
                }

                if (field === "specialWeight") return;

                setFormData((prev) => ({
                  ...prev,
                  [field]: value,
                }));
              }}
              InputProps={
                field === "specialWeight" ? { readOnly: true } : undefined
              }
              sx={{ mb: 2 }}
            />
          ))}

          {Array.isArray(customers) && customers.length > 0 && (
            <Select
              value={currentUser || customers[0].ID}
              onChange={handleCustomerSelectChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.username}
                </MenuItem>
              ))}
            </Select>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSaveSizing}
            sx={{ mt: 1 }}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default ShopDetails;
