import React, { useEffect, useMemo, useState } from "react";
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
import { calculatePieceWeightKg } from "../utils/sectionMath";

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
    "فولاد ساده": 7.85,
    "فولاد آلیاژی": 7.85,
    steel: 7.85,
    آلومینیوم: 2.7,
    الومینیوم: 2.7,
    aluminum: 2.7,
    "آلیاژ آلومینیوم": 2.7,
    استیل: 8,
    "فولاد ضدزنگ": 8,
    stainless: 8,
    مس: 8.9,
    copper: 8.9,
    برنج: 8.5,
    brass: 8.5,
    پلیمر: 2,
    polymer: 2,
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
  // ??????? ??? ? ??? ????
  // ------------------------------------------------------------
  const sectionContext = useMemo(
    () => ({
      sectionId:
        selectedProduct?.section_id ??
        selectedProduct?.shopProduct?.section_id ??
        null,
      sectionName: selectedProduct?.sectionName ?? "",
    }),
    [selectedProduct]
  );

  const resolvedSpecialWeight = useMemo(() => {
    const manualValue = Number(formData.specialWeight);
    if (manualValue && !Number.isNaN(manualValue)) {
      return manualValue;
    }
    if (!selectedProduct?.materialName) return null;
    return materialsSpecialWeights[selectedProduct.materialName] ?? null;
  }, [formData.specialWeight, selectedProduct]);

  useEffect(() => {
    if (!sectionContext.sectionId || !resolvedSpecialWeight) {
      return;
    }
    if (didUserChangeWeightManually) return;

    const calculated = calculatePieceWeightKg({
      sectionId: sectionContext.sectionId,
      sectionName: sectionContext.sectionName,
      width: formData.width,
      param_one: formData.param_one,
      param_two: formData.param_two,
      param_three: formData.param_three,
      specialWeight: resolvedSpecialWeight,
    });

    if (!calculated) {
      setFormData((prev) =>
        prev.weight === "" ? prev : { ...prev, weight: "" }
      );
      return;
    }

    const fixedValue = calculated.toFixed(3);
    setFormData((prev) =>
      prev.weight === fixedValue ? prev : { ...prev, weight: fixedValue }
    );
  }, [
    sectionContext.sectionId,
    sectionContext.sectionName,
    formData.width,
    formData.param_one,
    formData.param_two,
    formData.param_three,
    resolvedSpecialWeight,
    didUserChangeWeightManually,
  ]);

  useEffect(() => {
    const weightValue = Number(formData.weight);
    const countValue = Number(formData.number);

    if (!weightValue || Number.isNaN(weightValue)) {
      setFormData((prev) =>
        prev.totalWeight === "" ? prev : { ...prev, totalWeight: "" }
      );
      return;
    }

    const pieces = !countValue || Number.isNaN(countValue) ? 1 : countValue;
    const total = (weightValue * pieces).toFixed(2);

    setFormData((prev) =>
      prev.totalWeight === total ? prev : { ...prev, totalWeight: total }
    );
  }, [formData.weight, formData.number]);

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
      toast.success("Ø³Ø§ÛŒØ²Ø¨Ù†Ø¯ÛŒ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø°Ø®ÛŒØ±Ù‡ Ø´Ø¯");
      setOpen(false);
    } catch {
      toast.error("Ø®Ø·Ø§ Ø¯Ø± Ø°Ø®ÛŒØ±Ù‡ Ø³Ø§ÛŒØ²Ø¨Ù†Ø¯ÛŒ");
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
        toast.success("Ù…Ø­ØµÙˆÙ„ Ø§Ø² ÙØ±ÙˆØ´Ú¯Ø§Ù‡ Ø­Ø°Ù Ø´Ø¯");
      } else {
        await api.post("/shop-products", {
          shop_id: shopId,
          product_id: productId,
        });
        toast.success("Ù…Ø­ØµÙˆÙ„ Ø¨Ù‡ ÙØ±ÙˆØ´Ú¯Ø§Ù‡ Ø§Ø¶Ø§ÙÙ‡ Ø´Ø¯");
      }
      fetchShopProducts();
    } catch {
      toast.error("Ù…Ø´Ú©Ù„ÛŒ Ù¾ÛŒØ´ Ø¢Ù…Ø¯");
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
        <h1>Ù‡ÛŒÚ† ÙØ±ÙˆØ´Ú¯Ø§Ù‡ÛŒ Ù¾ÛŒØ¯Ø§ Ù†Ø´Ø¯</h1>
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Ù…Ø¯ÛŒØ±ÛŒØª Ù…Ø­ØµÙˆÙ„Ø§Øª ÙØ±ÙˆØ´Ú¯Ø§Ù‡ {shopName || shopId}
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
                    Ø³Ø§ÛŒØ²Ø¨Ù†Ø¯ÛŒ
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
            Ø³Ø§ÛŒØ²Ø¨Ù†Ø¯ÛŒ Ø¬Ø¯ÛŒØ¯
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
              value={currentUser || customers[1].id}
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
            Ø°Ø®ÛŒØ±Ù‡
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default ShopDetails;





