import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout/Layout";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api";
import { calculateCrossSectionArea } from "../utils/sectionMath";

const numberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatNumericValue = (value, fractionDigits = 0) => {
  if (value === undefined || value === null || value === "") return "-";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return parsed.toLocaleString("fa-IR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const resolveItemArea = (item) =>
  calculateCrossSectionArea({
    sectionId: item.section_id,
    sectionName: item.section_name,
    param_one: item.param_one,
    param_two: item.param_two,
    param_three: item.param_three,
  });

const resolveCuttingPriceForDisplay = (item) => {
  const base = numberOrNull(item.cutting_price);
  if (!base) return null;
  const area = resolveItemArea(item);
  if (!area) return base;
  return Number((base * area).toFixed(2));
};

const buildSectionConfigMap = (sectionsPayload = []) => {
  const map = {};
  sectionsPayload.forEach((section) => {
    map[section.ID] = {
      id: section.ID,
      name: section.name,
      params: section.params || 0,
      labels: {
        one: section.param_one || "پارامتر ۱",
        two: section.param_two || "پارامتر ۲",
        three: section.param_three || "پارامتر ۳",
      },
    };
  });
  return map;
};

const dimensionKeyForItem = (item, sectionConfigs) => {
  const sectionConfig = sectionConfigs[item.section_id];
  if (!sectionConfig || !sectionConfig.params) return null;

  const values = [];
  if (sectionConfig.params >= 1) values.push(item.param_one ?? null);
  if (sectionConfig.params >= 2) values.push(item.param_two ?? null);
  if (sectionConfig.params >= 3) values.push(item.param_three ?? null);

  if (values.some((val) => val == null)) return null;
  return values.join("�");
};

const dimensionLabelForItem = (item, sectionConfigs) => {
  const key = dimensionKeyForItem(item, sectionConfigs);
  if (!key) return "بدون ابعاد";
  return key.replace(/�/g, " � ");
};

function Storage() {
  const [shopId, setShopId] = useState(null);
  const [shopName, setShopName] = useState("");
  const [shopPhone, setShopPhone] = useState("");

  const [storageItems, setStorageItems] = useState([]);
  const [productsMeta, setProductsMeta] = useState([]);

  const [materialsList, setMaterialsList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [alloysList, setAlloysList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [sectionsConfigMap, setSectionsConfigMap] = useState({});

  const [filterSection, setFilterSection] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [filterAlloy, setFilterAlloy] = useState("");
  const [filterDimensionKey, setFilterDimensionKey] = useState("");

  const [inputWidth, setInputWidth] = useState("");
  const [inputNumber, setInputNumber] = useState("1");
  const [inputParamOne, setInputParamOne] = useState("");
  const [inputParamTwo, setInputParamTwo] = useState("");
  const [inputParamThree, setInputParamThree] = useState("");

  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [pricingSelling, setPricingSelling] = useState("");
  const [pricingCutting, setPricingCutting] = useState("");
  const [pricingTransportation, setPricingTransportation] = useState("");
  const [pricingLoading, setPricingLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isSectionSelected = Boolean(filterSection);

  useEffect(() => {
    fetchUserShop();
  }, []);

  const fetchUserShop = async () => {
    try {
      const userId = Number(localStorage.getItem("user_id"));
      const shopsRes = await api.get("/shops");
      const userShop = shopsRes.data.body?.find((s) => s.user_id === userId);

      if (!userShop) {
        toast.error("فروشگاهی برای کاربر یافت نشد");
        return;
      }

      setShopId(userShop.ID);
      setShopName(userShop.name);
      setShopPhone(userShop.phone);
      await fetchAllData(userShop.ID);
    } catch (err) {
      toast.error("خطا در دریافت اطلاعات فروشگاه");
    }
  };

  const fetchAllData = async (shopIdValue) => {
    try {
      const [sizesRes, productsRes, materialsRes, brandsRes, sectionsRes] =
        await Promise.all([
          api.get(`/products-size?shop_id=${shopIdValue}`),
          api.get(`/shop-products?shop_id=${shopIdValue}`),
          api.get(`/materials`),
          api.get(`/brands`),
          api.get(`/sections`),
        ]);

      const sizes = sizesRes.data.body || [];
      const products = productsRes.data.body || [];
      const materials = materialsRes.data.body || [];
      const brands = brandsRes.data.body || [];
      const sectionsPayload = sectionsRes.data.body || [];

      setMaterialsList(materials);
      setSectionsList([
        ...new Set(products.map((p) => p.section_name).filter(Boolean)),
      ]);
      setAlloysList([
        ...new Set(products.map((p) => p.alloy_name).filter(Boolean)),
      ]);
      setBrandsList(brands);
      setSectionsConfigMap(buildSectionConfigMap(sectionsPayload));

      const merged = sizes.map((size) => {
        const product = products.find((p) => p.ID === size.shop_products_id);
        return {
          ...size,
          width: numberOrNull(size.width),
          number: numberOrNull(size.number),
          weight: numberOrNull(size.weight),
          price: numberOrNull(size.price),
          selling_price: numberOrNull(size.selling_price),
          cutting_price: numberOrNull(size.cutting_price),
          transportation_price: numberOrNull(size.transportation_price),
          param_one: numberOrNull(size.param_one),
          param_two: numberOrNull(size.param_two),
          param_three: numberOrNull(size.param_three),
          section_name: product?.section_name || "",
          section_id: product?.section_id || null,
          material_name: product?.material_name || "",
          material_id: product?.material_id || null,
          alloy_name: product?.alloy_name || "",
          alloy_id: product?.alloy_id || null,
        };
      });

      setStorageItems(merged);
      setProductsMeta(products);
    } catch (err) {
      toast.error("خطا در دریافت داده‌ها");
    }
  };

  const filteredWithoutDimensions = useMemo(
    () =>
      storageItems.filter((item) => {
        return (
          (!filterSection || item.section_name === filterSection) &&
          (!filterMaterial || item.material_name === filterMaterial) &&
          (!filterAlloy || item.alloy_name === filterAlloy)
        );
      }),
    [storageItems, filterSection, filterMaterial, filterAlloy]
  );

  const dimensionOptions = useMemo(() => {
    const map = new Map();
    filteredWithoutDimensions.forEach((item) => {
      const key = dimensionKeyForItem(item, sectionsConfigMap);
      if (!key || map.has(key)) return;
      map.set(key, {
        key,
        label: dimensionLabelForItem(item, sectionsConfigMap),
      });
    });
    return Array.from(map.values());
  }, [filteredWithoutDimensions, sectionsConfigMap]);

  const filteredItems = useMemo(() => {
    if (!filterDimensionKey) return filteredWithoutDimensions;
    return filteredWithoutDimensions.filter(
      (item) =>
        dimensionKeyForItem(item, sectionsConfigMap) === filterDimensionKey
    );
  }, [filteredWithoutDimensions, filterDimensionKey, sectionsConfigMap]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const allFiltersSelected = Boolean(
    filterSection && filterMaterial && filterAlloy && filterDimensionKey
  );

  const selectedSize = useMemo(() => {
    if (!allFiltersSelected) return null;
    return (
      storageItems.find(
        (item) =>
          item.section_name === filterSection &&
          item.material_name === filterMaterial &&
          item.alloy_name === filterAlloy &&
          dimensionKeyForItem(item, sectionsConfigMap) === filterDimensionKey
      ) || null
    );
  }, [
    allFiltersSelected,
    storageItems,
    filterSection,
    filterMaterial,
    filterAlloy,
    filterDimensionKey,
    sectionsConfigMap,
  ]);

  const selectedProduct = useMemo(() => {
    if (!selectedSize) return null;
    return (
      productsMeta.find(
        (product) => product.ID === selectedSize.shop_products_id
      ) || null
    );
  }, [selectedSize, productsMeta]);

  useEffect(() => {
    if (!selectedSize) {
      setInputParamOne("");
      setInputParamTwo("");
      setInputParamThree("");
      return;
    }
    setInputParamOne(
      selectedSize.param_one != null ? String(selectedSize.param_one) : ""
    );
    setInputParamTwo(
      selectedSize.param_two != null ? String(selectedSize.param_two) : ""
    );
    setInputParamThree(
      selectedSize.param_three != null ? String(selectedSize.param_three) : ""
    );
  }, [selectedSize]);

  const sectionParamConfig = useMemo(() => {
    if (!selectedProduct?.section_id) return null;
    const config = sectionsConfigMap[selectedProduct.section_id];
    if (!config) return null;
    return {
      requiresParamOne: config.params >= 1,
      requiresParamTwo: config.params >= 2,
      requiresParamThree: config.params >= 3,
      paramOneLabel: config.labels.one,
      paramTwoLabel: config.labels.two,
      paramThreeLabel: config.labels.three,
    };
  }, [sectionsConfigMap, selectedProduct]);

  const pricingComplete = useMemo(() => {
    if (!selectedSize) return false;
    const selling = numberOrNull(selectedSize.selling_price);
    const cutting = numberOrNull(selectedSize.cutting_price);
    const transportation = numberOrNull(selectedSize.transportation_price);
    return (
      selling != null &&
      selling > 0 &&
      cutting != null &&
      cutting > 0 &&
      transportation != null &&
      transportation > 0
    );
  }, [selectedSize]);

  const requiredParamsMissing = useMemo(() => {
    if (!sectionParamConfig) return false;
    if (
      sectionParamConfig.requiresParamOne &&
      numberOrNull(inputParamOne) == null
    ) {
      return true;
    }
    if (
      sectionParamConfig.requiresParamTwo &&
      numberOrNull(inputParamTwo) == null
    ) {
      return true;
    }
    if (
      sectionParamConfig.requiresParamThree &&
      numberOrNull(inputParamThree) == null
    ) {
      return true;
    }
    return false;
  }, [sectionParamConfig, inputParamOne, inputParamTwo, inputParamThree]);

  const resetModalState = () => {
    setSelectedCustomer("");
    setSelectedBrand("");
  };

  const openCreateModal = async () => {
    if (!selectedSize || !selectedProduct) {
      toast.error("برای ثبت پیش‌فاکتور باید یک سایز با همه فیلترها انتخاب شود");
      return;
    }
    if (!shopId) {
      toast.error("فروشگاه مشخص نیست");
      return;
    }
    try {
      const res = await api.get(`/customers?shop_id=${shopId}`);
      const customersPayload = res.data.body || res.data || [];
      setCustomers(Array.isArray(customersPayload) ? customersPayload : []);
      setModalOpen(true);
    } catch (err) {
      toast.error("خطا در دریافت مشتریان");
    }
  };

  const findCustomerById = (id) =>
    customers.find((customer) => (customer.id ?? customer.ID) === id) || null;

  const findBrandById = (id) =>
    brandsList.find((brand) => brand.ID === id) || null;

  const openPricingModal = () => {
    if (!filteredItems.length) {
      toast.error("هیچ سایزی برای قیمت‌گذاری انتخاب نشده است");
      return;
    }
    const baseItem = filteredItems[0];
    setPricingSelling(
      baseItem?.selling_price != null ? String(baseItem.selling_price) : ""
    );
    setPricingCutting(
      baseItem?.cutting_price != null ? String(baseItem.cutting_price) : ""
    );
    setPricingTransportation(
      baseItem?.transportation_price != null
        ? String(baseItem.transportation_price)
        : ""
    );
    setPricingModalOpen(true);
  };

  const handleApplyPricing = async () => {
    const ids = filteredItems.map((item) => item.ID);
    if (!ids.length) {
      toast.error("هیچ موردی برای اعمال قیمت انتخاب نشده است");
      return;
    }

    const sellingValue = numberOrNull(pricingSelling);
    const cuttingValue = numberOrNull(pricingCutting);
    const transportationValue = numberOrNull(pricingTransportation);

    if (!sellingValue || sellingValue <= 0) {
      toast.error("قیمت فروش نامعتبر است");
      return;
    }
    if (!cuttingValue || cuttingValue <= 0) {
      toast.error("هزینه برش نامعتبر است");
      return;
    }
    if (!transportationValue || transportationValue <= 0) {
      toast.error("هزینه حمل نامعتبر است");
      return;
    }

    setPricingLoading(true);
    try {
      await api.post("/products-size/pricing", {
        product_size_ids: ids,
        selling_price: sellingValue,
        cutting_price: cuttingValue,
        transportation_price: transportationValue,
      });

      const idSet = new Set(ids);
      setStorageItems((prev) =>
        prev.map((item) =>
          idSet.has(item.ID)
            ? {
                ...item,
                selling_price: sellingValue,
                cutting_price: cuttingValue,
                transportation_price: transportationValue,
                price: sellingValue,
              }
            : item
        )
      );

      toast.success("قیمت‌ها با موفقیت ثبت شد");
      setPricingModalOpen(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "ثبت قیمت‌ها با خطا مواجه شد"
      );
    } finally {
      setPricingLoading(false);
    }
  };

  const handleCreatePreInvoice = async () => {
    if (!selectedSize || !selectedProduct || !shopId) {
      toast.error("اطلاعات لازم برای ساخت پیش‌فاکتور کامل نیست");
      return;
    }

    const widthValue = numberOrNull(inputWidth);
    const numberValue = Number(inputNumber) > 0 ? Number(inputNumber) : null;
    const brandId = Number(selectedBrand) || null;
    const customerId = Number(selectedCustomer) || null;
    const paramOneValue = numberOrNull(inputParamOne);
    const paramTwoValue = numberOrNull(inputParamTwo);
    const paramThreeValue = numberOrNull(inputParamThree);
    const sellingPriceValue = numberOrNull(selectedSize.selling_price);
    const cuttingPriceValue = numberOrNull(selectedSize.cutting_price);
    const transportationPriceValue = numberOrNull(
      selectedSize.transportation_price
    );

    if (!customerId) {
      toast.error("لطفاً مشتری را انتخاب کنید");
      return;
    }
    if (!brandId) {
      toast.error("لطفاً برند را انتخاب کنید");
      return;
    }
    if (!widthValue || widthValue <= 0) {
      toast.error("طول وارد شده معتبر نیست");
      return;
    }
    if (!numberValue || numberValue <= 0) {
      toast.error("تعداد وارد شده معتبر نیست");
      return;
    }
    if (!sellingPriceValue || sellingPriceValue <= 0) {
      toast.error("برای ایجاد پیش‌فاکتور ابتدا قیمت فروش را مشخص کنید.");
      return;
    }
    if (!cuttingPriceValue || cuttingPriceValue <= 0) {
      toast.error("هزینه برش باید بیشتر از صفر باشد.");
      return;
    }
    if (!transportationPriceValue || transportationPriceValue <= 0) {
      toast.error("هزینه حمل باید بیشتر از صفر باشد.");
      return;
    }
    if (
      sectionParamConfig?.requiresParamOne &&
      (!paramOneValue || paramOneValue <= 0)
    ) {
      toast.error(`${sectionParamConfig.paramOneLabel} باید مقدار داشته باشد`);
      return;
    }
    if (
      sectionParamConfig?.requiresParamTwo &&
      (!paramTwoValue || paramTwoValue <= 0)
    ) {
      toast.error(`${sectionParamConfig.paramTwoLabel} باید مقدار داشته باشد`);
      return;
    }
    if (
      sectionParamConfig?.requiresParamThree &&
      (!paramThreeValue || paramThreeValue <= 0)
    ) {
      toast.error(
        `${sectionParamConfig.paramThreeLabel} باید مقدار داشته باشد`
      );
      return;
    }
    if (
      !sectionParamConfig?.requiresParamTwo &&
      paramTwoValue != null &&
      paramTwoValue < 0
    ) {
      toast.error("پارامتر دوم نمی‌تواند مقدار منفی داشته باشد");
      return;
    }
    if (
      !sectionParamConfig?.requiresParamThree &&
      paramThreeValue != null &&
      paramThreeValue < 0
    ) {
      toast.error("پارامتر سوم نمی‌تواند مقدار منفی داشته باشد");
      return;
    }

    const customer = findCustomerById(customerId);
    if (!customer) {
      toast.error("مشتری انتخاب‌شده معتبر نیست");
      return;
    }
    const brandInfo = findBrandById(brandId);

    const payload = {
      product_size_id: selectedSize.ID,
      parent_product_size_id: selectedSize.parent_product_size_id ?? null,
      shop_products_id: selectedSize.shop_products_id,
      shop_id: shopId,
      section_id: selectedProduct.section_id,
      material_id: selectedProduct.material_id,
      param_one: paramOneValue,
      param_two: paramTwoValue,
      param_three: paramThreeValue,
      width: widthValue,
      number: numberValue,
      price: sellingPriceValue,
      selling_price: sellingPriceValue,
      cutting_price: cuttingPriceValue,
      transportation_price: transportationPriceValue,
      manual_brand_id: brandId,
      manual_brand_name: brandInfo?.name ?? null,
      customer_name: customer.username ?? customer.name ?? null,
      buyer_info: {
        name: customer.username ?? customer.name ?? "",
        mobile: customer.telephone ?? customer.mobile ?? "",
      },
      seller_info: { name: shopName, mobile: shopPhone },
    };

    try {
      await api.post("/preinvoices", payload);
      toast.success("پیش‌فاکتور با موفقیت ثبت شد");
      setModalOpen(false);
      resetModalState();
      setInputWidth("");
      setInputNumber("1");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "ثبت پیش‌فاکتور با خطا مواجه شد"
      );
    }
  };

  const createDisabled =
    !inputWidth || !inputNumber || requiredParamsMissing || !pricingComplete;

  return (
    <Layout>
      <Toaster />

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {shopName ? `انبار فروشگاه ${shopName}` : "در حال دریافت اطلاعات..."}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>نوع مقطع</InputLabel>
          <Select
            value={filterSection}
            label="نوع مقطع"
            onChange={(e) => {
              setFilterSection(e.target.value);
              setFilterDimensionKey("");
              setCurrentPage(1);
            }}
          >
            <MenuItem value="">همه</MenuItem>
            {sectionsList.map((sec) => (
              <MenuItem key={sec} value={sec}>
                {sec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>جنس</InputLabel>
          <Select
            value={filterMaterial}
            label="جنس"
            onChange={(e) => {
              setFilterMaterial(e.target.value);
              setFilterDimensionKey("");
              setCurrentPage(1);
            }}
          >
            <MenuItem value="">همه</MenuItem>
            {materialsList.map((mat) => (
              <MenuItem key={mat.ID} value={mat.name}>
                {mat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>آلیاژ</InputLabel>
          <Select
            value={filterAlloy}
            label="آلیاژ"
            onChange={(e) => {
              setFilterAlloy(e.target.value);
              setFilterDimensionKey("");
              setCurrentPage(1);
            }}
          >
            <MenuItem value="">همه</MenuItem>
            {alloysList.map((alloy) => (
              <MenuItem key={alloy} value={alloy}>
                {alloy}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }} disabled={!dimensionOptions.length}>
          <InputLabel>ابعاد</InputLabel>
          <Select
            value={filterDimensionKey}
            label="ابعاد"
            onChange={(e) => {
              setFilterDimensionKey(e.target.value);
              setCurrentPage(1);
            }}
          >
            <MenuItem value="">همه</MenuItem>
            {dimensionOptions.map((dimension) => (
              <MenuItem key={dimension.key} value={dimension.key}>
                {dimension.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isSectionSelected && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <Button
            variant="outlined"
            onClick={openPricingModal}
            disabled={!filteredItems.length}
          >
            قیمت‌گذاری
          </Button>
        </Box>
      )}

      {allFiltersSelected && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <TextField
            label="طول برش (میلی‌متر)"
            value={inputWidth}
            onChange={(e) => setInputWidth(e.target.value)}
            type="number"
            sx={{ width: 200 }}
          />
          <TextField
            label="تعداد"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            type="number"
            sx={{ width: 160 }}
          />
          {sectionParamConfig?.requiresParamOne && (
            <TextField
              label={sectionParamConfig.paramOneLabel}
              value={inputParamOne}
              onChange={(e) => setInputParamOne(e.target.value)}
              type="number"
              sx={{ width: 200 }}
            />
          )}
          {sectionParamConfig?.requiresParamTwo && (
            <TextField
              label={sectionParamConfig.paramTwoLabel}
              value={inputParamTwo}
              onChange={(e) => setInputParamTwo(e.target.value)}
              type="number"
              sx={{ width: 200 }}
            />
          )}
          {sectionParamConfig?.requiresParamThree && (
            <TextField
              label={sectionParamConfig.paramThreeLabel}
              value={inputParamThree}
              onChange={(e) => setInputParamThree(e.target.value)}
              type="number"
              sx={{ width: 200 }}
            />
          )}
          <Button
            variant="contained"
            onClick={openCreateModal}
            disabled={createDisabled}
          >
            ایجاد پیش‌فاکتور
          </Button>
        </Box>
      )}

      <Modal open={pricingModalOpen} onClose={() => setPricingModalOpen(false)}>
        <Box
          sx={{
            background: "white",
            padding: 3,
            width: 360,
            mx: "auto",
            mt: 12,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">قیمت‌گذاری</Typography>
          <Typography variant="body2" color="text.secondary">
            تعداد سایزهای انتخاب‌شده: {filteredItems.length}
          </Typography>

          <TextField
            label="قیمت فروش"
            type="number"
            value={pricingSelling}
            onChange={(e) => setPricingSelling(e.target.value)}
          />
          <TextField
            label="هزینه برش (به ازای واحد)"
            type="number"
            value={pricingCutting}
            onChange={(e) => setPricingCutting(e.target.value)}
          />
          <TextField
            label="هزینه حمل"
            type="number"
            value={pricingTransportation}
            onChange={(e) => setPricingTransportation(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleApplyPricing}
            disabled={pricingLoading}
          >
            {pricingLoading ? "در حال اعمال..." : "ذخیره قیمت‌ها"}
          </Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          {" "}
          <TableHead>
            <TableRow>
              <TableCell>شناسه</TableCell>
              <TableCell>مقطع</TableCell>
              <TableCell>جنس</TableCell>
              <TableCell>آلیاژ</TableCell>
              <TableCell>پارامتر ۱</TableCell>
              <TableCell>پارامتر ۲</TableCell>
              <TableCell>پارامتر ۳</TableCell>
              <TableCell>طول (میلی‌متر)</TableCell>
              <TableCell>وزن واحد (کیلوگرم)</TableCell>
              <TableCell>تعداد</TableCell>
              <TableCell>قیمت فروش</TableCell>
              <TableCell>هزینه برش</TableCell>
              <TableCell>هزینه حمل</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.ID}>
                <TableCell>{item.ID}</TableCell>
                <TableCell>{item.section_name}</TableCell>
                <TableCell>{item.material_name}</TableCell>
                <TableCell>{item.alloy_name}</TableCell>
                <TableCell>{item.param_one || "-"}</TableCell>
                <TableCell>{item.param_two || "-"}</TableCell>
                <TableCell>{item.param_three || "-"}</TableCell>
                <TableCell>{formatNumericValue(item.width, 0)}</TableCell>
                <TableCell>{formatNumericValue(item.weight, 3)}</TableCell>
                <TableCell>{formatNumericValue(item.number, 0)}</TableCell>
                <TableCell>
                  {formatNumericValue(item.selling_price, 0)}
                </TableCell>
                <TableCell>
                  {formatNumericValue(resolveCuttingPriceForDisplay(item), 0)}
                </TableCell>
                <TableCell>
                  {formatNumericValue(item.transportation_price, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ArrowBigRightDashIcon />
        </Button>
        <Typography>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <ArrowBigLeftDashIcon />
        </Button>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            background: "white",
            padding: 3,
            width: 400,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">انتخاب مشتری و برند</Typography>

          <FormControl fullWidth>
            <InputLabel>مشتری</InputLabel>
            <Select
              value={selectedCustomer}
              label="مشتری"
              onChange={(e) => setSelectedCustomer(Number(e.target.value))}
            >
              {customers.map((customer) => {
                const id = customer.id ?? customer.ID;
                const label = customer.username ?? customer.name ?? id;
                return (
                  <MenuItem key={id} value={id}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {selectedCustomer && (
            <TextField
              label="شماره تماس"
              value={
                findCustomerById(selectedCustomer)?.telephone ||
                findCustomerById(selectedCustomer)?.mobile ||
                ""
              }
              disabled
            />
          )}

          <FormControl fullWidth>
            <InputLabel>برند</InputLabel>
            <Select
              value={selectedBrand}
              label="برند"
              onChange={(e) => setSelectedBrand(Number(e.target.value))}
            >
              {brandsList.map((brand) => (
                <MenuItem key={brand.ID} value={brand.ID}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="success"
            onClick={handleCreatePreInvoice}
          >
            ثبت پیش‌فاکتور
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Storage;
