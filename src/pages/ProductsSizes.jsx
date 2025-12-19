import React, { useEffect, useState, useRef, useMemo } from "react";
import Layout from "../components/Layout/Layout";
import api from "../api"; // ✅ centralized axios instance
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

function ProductSizes() {
  const [sizes, setSizes] = useState([]);
  const [sections] = useState([
    { id: 1, name: "گرد" },
    { id: 2, name: "ورق" },
    { id: 3, name: "لوله" },
    { id: 4, name: "تسمه" },
  ]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editData, setEditData] = useState({});
  const [sizeId, setSizeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const shopIdRef = useRef();
  const productIdRef = useRef();
  const paramOneRef = useRef();
  const paramTwoRef = useRef();
  const paramThreeRef = useRef();
  const widthRef = useRef();
  const [selectedSection, setSelectedSection] = useState(1);

  const baseURL = "/products-size";

  // Fetch all product sizes
  const fetchSizes = async () => {
    try {
      const res = await api.get(baseURL);
      setSizes(res.data.body || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت اندازه‌ها");
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // Add size
  const handleAddSize = () => {
    const shop_id = shopIdRef.current.value.trim();
    const product_id = productIdRef.current.value.trim();
    const param_one = paramOneRef.current.value.trim();
    const param_two = paramTwoRef.current.value.trim();
    const param_three = paramThreeRef.current.value.trim();
    const width = widthRef.current.value.trim();

    if (!shop_id || !product_id || !width) {
      toast.error("فیلدهای ضروری را پر کنید");
      return;
    }

    api
      .post(baseURL, {
        shop_id,
        product_id,
        param_one,
        param_two,
        param_three,
        width,
        section_id: selectedSection,
      })
      .then(() => {
        fetchSizes();
        setOpenAdd(false);
        toast.success("اندازه محصول با موفقیت اضافه شد");
      })
      .catch((err) => {
        console.error(err);
        toast.error("مشکلی پیش آمد");
      });
  };

  // Delete size
  const handleDeleteSize = (id) => {
    api
      .delete(`${baseURL}/${id}`)
      .then(() => {
        fetchSizes();
        setOpenDelete(false);
        toast.success("اندازه محصول با موفقیت حذف شد");
      })
      .catch((err) => {
        console.error(err);
        toast.error("مشکلی پیش آمد");
      });
  };

  // Edit size
  const handleEditOpen = (size) => {
    setSizeId(size.ID);
    setEditData({ ...size });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSizeId("");
    setEditData({});
  };

  const handleUpdateSize = () => {
    api
      .put(`${baseURL}/${sizeId}`, editData)
      .then(() => {
        fetchSizes();
        handleEditClose();
        toast.success("اندازه محصول با موفقیت ویرایش شد");
      })
      .catch((err) => {
        console.error(err);
        toast.error("مشکلی پیش آمد");
      });
  };

  // Search & pagination
  const filteredSizes = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return sizes.filter(
      (s) =>
        s.product_id?.toString().includes(search) ||
        s.param_one?.toLowerCase().includes(search) ||
        s.param_two?.toLowerCase().includes(search) ||
        s.param_three?.toLowerCase().includes(search) ||
        s.width?.toString().includes(search)
    );
  }, [sizes, searchTerm]);

  const currentSizes = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredSizes.slice(indexOfFirst, indexOfLast);
  }, [filteredSizes, currentPage]);

  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);

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

  return (
    <Layout>
      <Toaster position="top-center" />
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{ ...buttonBase, backgroundColor: "#FB431A", color: "#fff" }}
          onClick={() => setOpenAdd(true)}
        >
          افزودن اندازه محصول
        </Button>
        <TextField
          placeholder="جستجو..."
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

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>شناسه محصول</TableCell>
              <TableCell>پارامتر ۱</TableCell>
              <TableCell>پارامتر ۲</TableCell>
              <TableCell>پارامتر ۳</TableCell>
              <TableCell>عرض</TableCell>
              <TableCell>مقطع</TableCell>
              <TableCell sx={{ textAlign: "center" }}>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSizes.map((size) => (
              <TableRow key={size.ID} hover>
                <TableCell>{size.ID}</TableCell>
                <TableCell>{size.product_id}</TableCell>
                <TableCell>{size.param_one || "-"}</TableCell>
                <TableCell>{size.param_two || "-"}</TableCell>
                <TableCell>{size.param_three || "-"}</TableCell>
                <TableCell>{size.width}</TableCell>
                <TableCell>
                  {sections.find((s) => s.id === size.section_id)?.name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    sx={{
                      ...buttonBase,
                      backgroundColor: "#4096ff",
                      color: "#fff",
                      mr: 1,
                    }}
                    onClick={() => handleEditOpen(size)}
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
                      setSizeId(size.ID);
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

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ArrowBigRightDashIcon />
        </Button>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <ArrowBigLeftDashIcon />
        </Button>
      </Box>

      {/* Add Modal */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            افزودن اندازه محصول
          </Typography>
          <TextField
            label="شناسه فروشگاه"
            inputRef={shopIdRef}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="شناسه محصول"
            inputRef={productIdRef}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="پارامتر ۱"
            inputRef={paramOneRef}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="پارامتر ۲"
            inputRef={paramTwoRef}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="پارامتر ۳"
            inputRef={paramThreeRef}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField label="عرض" inputRef={widthRef} fullWidth sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>مقطع</InputLabel>
            <Select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sections.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleAddSize}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            آیا از حذف اطمینان دارید؟
          </Typography>
          <Button
            sx={{
              ...buttonBase,
              m: 1,
              backgroundColor: "#1D72E8",
              color: "#fff",
            }}
            onClick={() => handleDeleteSize(sizeId)}
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
      <Modal open={openEdit} onClose={handleEditClose} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            ویرایش اندازه محصول
          </Typography>
          <TextField
            label="پارامتر ۱"
            value={editData.param_one || ""}
            onChange={(e) =>
              setEditData({ ...editData, param_one: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="پارامتر ۲"
            value={editData.param_two || ""}
            onChange={(e) =>
              setEditData({ ...editData, param_two: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="پارامتر ۳"
            value={editData.param_three || ""}
            onChange={(e) =>
              setEditData({ ...editData, param_three: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="عرض"
            value={editData.width || ""}
            onChange={(e) =>
              setEditData({ ...editData, width: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>مقطع</InputLabel>
            <Select
              value={editData.section_id || 1}
              onChange={(e) =>
                setEditData({ ...editData, section_id: e.target.value })
              }
            >
              {sections.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleUpdateSize}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default ProductSizes;
