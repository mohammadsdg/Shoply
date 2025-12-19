import React, { useEffect, useState, useMemo } from "react";
import Layout from "../Layout/Layout";
import api from "../../api";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [sections, setSections] = useState([]);
  const [alloys, setAlloys] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groupings, setGroupings] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [productId, setProductId] = useState(null);
  const [editData, setEditData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // all select states as strings for consistency
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedAlloy, setSelectedAlloy] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedGrouping, setSelectedGrouping] = useState("");

  const fetchAllData = async () => {
    try {
      const [prodRes, matRes, secRes, brandRes] = await Promise.all([
        api.get("/products"),
        api.get("/materials"),
        api.get("/sections"),
        api.get("/brands"),
      ]);
      setProducts(prodRes.data.body || []);
      setMaterials(matRes.data.body || []);
      setSections(secRes.data.body || []);
      setBrands(brandRes.data.body || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // fetch groupings whenever section/material change
  useEffect(() => {
    const fetchGroupings = async () => {
      if (selectedSection && selectedMaterial) {
        try {
          const res = await api.get(
            `/groupings?material_id=${selectedMaterial}&section_id=${selectedSection}`
          );
          const newData = res.data.body || [];
          setGroupings((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(newData))
              return newData;
            return prev;
          });
        } catch {
          setGroupings([]);
          toast.error("خطا در دریافت دسته‌بندی‌ها");
        }
      } else {
        setGroupings([]);
      }
    };
    fetchGroupings();
  }, [selectedSection, selectedMaterial]);

  // fetch alloys when material selected
  useEffect(() => {
    const fetchAlloys = async () => {
      if (selectedMaterial) {
        try {
          const res = await api.get(`/alloys?material_id=${selectedMaterial}`);
          setAlloys(res.data.body || []);
        } catch {
          setAlloys([]);
          toast.error("خطا در دریافت آلیاژها");
        }
      } else {
        setAlloys([]);
      }
    };
    fetchAlloys();
  }, [selectedMaterial]);

  const handleAddProduct = () => {
    if (
      !selectedMaterial ||
      !selectedSection ||
      !selectedAlloy ||
      !selectedBrand ||
      !selectedGrouping
    ) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }

    api
      .post("/products", {
        material_id: Number(selectedMaterial),
        section_id: Number(selectedSection),
        alloy_id: Number(selectedAlloy),
        brand_id: Number(selectedBrand),
        grouping_id: Number(selectedGrouping),
      })
      .then(() => {
        fetchAllData();
        setOpenAdd(false);
        setSelectedMaterial("");
        setSelectedSection("");
        setSelectedAlloy("");
        setSelectedBrand("");
        setSelectedGrouping("");
        toast.success("محصول با موفقیت اضافه شد");
      })
      .catch(() => toast.error("مشکلی پیش آمد"));
  };

  const handleDeleteProduct = (id) => {
    api
      .delete(`/products/${id}`)
      .then(() => {
        fetchAllData();
        setOpenDelete(false);
        toast.success("محصول با موفقیت حذف شد");
      })
      .catch(() => toast.error("مشکلی پیش آمد"));
  };

  const handleEditOpen = async (product) => {
    try {
      const res = await api.get(`/products/${product.ID}`);
      const result = res.data.body.result;
      setProductId(product.ID);
      setEditData({ ...result });
      setOpenEdit(true);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت اطلاعات محصول");
    }
  };

  const handleUpdateProduct = () => {
    api
      .put(`/products/${productId}`, {
        material_id: Number(editData.material_id),
        section_id: Number(editData.section_id),
        alloy_id: Number(editData.alloy_id),
        brand_id: Number(editData.brand_id),
        grouping_id: Number(editData.grouping_id),
      })
      .then(() => {
        fetchAllData();
        setOpenEdit(false);
        toast.success("محصول با موفقیت ویرایش شد");
      })
      .catch(() => toast.error("مشکلی پیش آمد"));
  };

  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.alloyName?.toLowerCase().includes(search) ||
        p.alloyCode?.toLowerCase().includes(search) ||
        p.brandName?.toLowerCase().includes(search) ||
        p.sectionName?.toLowerCase().includes(search) ||
        p.groupingName?.toLowerCase().includes(search) ||
        p.materialName?.toLowerCase().includes(search)
    );
  }, [products, searchTerm]);

  const currentProducts = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredProducts.slice(indexOfFirst, indexOfLast);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const buttonBase = {
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    textTransform: "none",
    transition: "all 0.2s ease",
  };

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

  const commonSelectProps = {
    fullWidth: true,
    MenuProps: {
      disablePortal: false,
      container: document.body,
    },
  };

  return (
    <Layout>
      <Toaster position="top-center" />
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{ ...buttonBase, backgroundColor: "#FB431A", color: "#fff" }}
          onClick={() => setOpenAdd(true)}
        >
          افزودن محصول
        </Button>
        <TextField
          placeholder="جستجوی محصول..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          sx={{ minWidth: "90%" }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ "& *": { fontSize: "14px !important" } }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>نام آلیاژ</TableCell>
              <TableCell>کد آلیاژ</TableCell>
              <TableCell>برند</TableCell>
              <TableCell>مقطع</TableCell>
              <TableCell>دسته بندی</TableCell>
              <TableCell>متریال</TableCell>
              <TableCell sx={{ textAlign: "center" }}>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow key={product.ID} hover>
                <TableCell>{product.ID}</TableCell>
                <TableCell>{product.alloyName || "-"}</TableCell>
                <TableCell>{product.alloyCode || "-"}</TableCell>
                <TableCell>{product.brandName || "-"}</TableCell>
                <TableCell>{product.sectionName || "-"}</TableCell>
                <TableCell>{product.groupingName || "-"}</TableCell>
                <TableCell>{product.materialName || "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    sx={{
                      ...buttonBase,
                      backgroundColor: "#4096ff",
                      color: "#fff",
                      mr: 1,
                    }}
                    onClick={() => handleEditOpen(product)}
                  >
                    ویرایش
                  </Button>
                  <Button
                    sx={{
                      ...buttonBase,
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                    }}
                    onClick={() => {
                      setOpenDelete(true);
                      setProductId(product.ID);
                    }}
                  >
                    حذف
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
        <Button
          variant="text"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <ArrowBigRightDashIcon />
        </Button>
        <Typography>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          variant="text"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <ArrowBigLeftDashIcon />
        </Button>
      </Box>

      {/* Add Modal */}
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        disableEnforceFocus
      >
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            محصول جدید ایجاد کنید
          </Typography>

          {/* Section, Material, Brand */}
          {[
            {
              label: "مقطع",
              data: sections,
              value: selectedSection,
              setValue: setSelectedSection,
            },
            {
              label: "متریال",
              data: materials,
              value: selectedMaterial,
              setValue: setSelectedMaterial,
            },
            {
              label: "برند",
              data: brands,
              value: selectedBrand,
              setValue: setSelectedBrand,
            },
          ].map(({ label, data, value, setValue }) => (
            <FormControl key={label} fullWidth sx={{ mb: 2 }}>
              <InputLabel>{label}</InputLabel>
              <Select
                {...commonSelectProps}
                value={value}
                onChange={(e) => setValue(String(e.target.value))}
              >
                {data.map((item) => (
                  <MenuItem key={item.ID} value={String(item.ID)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {/* Alloy */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>آلیاژ</InputLabel>
            <Select
              {...commonSelectProps}
              value={selectedAlloy}
              onChange={(e) => setSelectedAlloy(String(e.target.value))}
              disabled={!alloys.length}
            >
              {alloys.map((item) => (
                <MenuItem key={item.ID} value={String(item.ID)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Grouping */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>دسته بندی</InputLabel>
            <Select
              {...commonSelectProps}
              value={selectedGrouping}
              onChange={(e) => {
                console.log(groupings);
                setSelectedGrouping(e.target.value)
              }}
              disabled={!groupings.length}
            >
              {groupings.map((item) => (
                <MenuItem key={item.ID} value={String(item.ID)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleAddProduct}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            آیا از حذف خود اطمینان دارید؟
          </Typography>
          <Button
            sx={{
              ...buttonBase,
              m: 1,
              backgroundColor: "#1D72E8",
              color: "#fff",
            }}
            onClick={() => handleDeleteProduct(productId)}
          >
            بله
          </Button>
          <Button
            sx={{
              ...buttonBase,
              m: 1,
              backgroundColor: "#ff6347",
              color: "#fff",
            }}
            onClick={() => setOpenDelete(false)}
          >
            خیر
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        disableEnforceFocus
      >
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            ویرایش محصول
          </Typography>
          {[
            { label: "مقطع", data: sections, key: "section_id" },
            { label: "متریال", data: materials, key: "material_id" },
            { label: "برند", data: brands, key: "brand_id" },
            { label: "آلیاژ", data: alloys, key: "alloy_id" },
            { label: "دسته بندی", data: groupings, key: "grouping_id" },
          ].map(({ label, data, key }) => (
            <FormControl key={label} fullWidth sx={{ mb: 2 }}>
              <InputLabel>{label}</InputLabel>
              <Select
                {...commonSelectProps}
                value={editData[key] ? String(editData[key]) : ""}
                onChange={(e) =>
                  setEditData({ ...editData, [key]: String(e.target.value) })
                }
              >
                {data.map((item) => (
                  <MenuItem key={item.ID} value={String(item.ID)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleUpdateProduct}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Products;
