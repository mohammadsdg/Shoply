import React, { useEffect, useState, useRef, useMemo } from "react";
import Layout from "../components/Layout/Layout";
import api from "../api"; // centralized axios instance
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

function Groupings() {
  const [groupings, setGroupings] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [sections, setSections] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editData, setEditData] = useState({});
  const [groupingId, setGroupingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nameRef = useRef();
  const materialRef = useRef();
  const sectionRef = useRef();

  // Add inside your component
  const [materialValue, setMaterialValue] = useState("");
  const [sectionValue, setSectionValue] = useState("");

  const fetchAllData = async () => {
    try {
      const [groupRes, matRes, secRes] = await Promise.all([
        api.get("/groupings"),
        api.get("/materials"),
        api.get("/sections"),
      ]);

      setGroupings(groupRes.data.body || []);
      setMaterials(matRes.data.body || []);
      setSections(secRes.data.body || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddGrouping = () => {
    const name = nameRef.current.value.trim();

    if (!name) {
      toast.error("نام دسته بندی الزامی است");
      return;
    }

    api
      .post("/groupings", {
        name,
        material_id: materialValue,
        section_id: sectionValue,
      })
      .then(() => {
        fetchAllData();
        setOpenAdd(false);

        nameRef.current.value = "";
        setMaterialValue("");
        setSectionValue("");

        toast.success("دسته بندی با موفقیت اضافه شد");
      })
      .catch((err) => {
        console.error(err);
        toast.error("مشکلی پیش آمد");
      });
  };

  const handleDeleteGrouping = (id) => {
    api
      .delete(`/groupings/${id}`)
      .then(() => {
        fetchAllData();
        setOpenDelete(false);
        toast.success("دسته بندی با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
        console.error(err);
      });
  };

  const handleEditOpen = (grouping) => {
    setGroupingId(grouping.ID);
    setEditData({
      name: grouping.name,
      material_id: grouping.material_id,
      section_id: grouping.section_id,
    });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setGroupingId("");
    setEditData({});
  };

  const handleUpdateGrouping = () => {
    if (!editData.name.trim()) {
      toast.error("نام دسته بندی الزامی است");
      return;
    }

    api
      .put(`/groupings/${groupingId}`, editData)
      .then(() => {
        fetchAllData();
        handleEditClose();
        toast.success("دسته بندی با موفقیت ویرایش شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
        console.error(err);
      });
  };

  const filteredGroupings = useMemo(() => {
    return groupings.filter((g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupings, searchTerm]);

  const currentGroupings = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredGroupings.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredGroupings, currentPage]);

  const totalPages = Math.ceil(filteredGroupings.length / itemsPerPage);

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
      <Toaster position="top-center" reverseOrder={false} />
      <Box sx={{ display: "flex", gap: 2, mb: "1rem", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{
            ...buttonBase,
            backgroundColor: "#FB431A",
            color: "#fff",
            "&:hover": { backgroundColor: "#e33b17" },
          }}
          onClick={() => {
            setOpenAdd(true);
            if (nameRef.current) nameRef.current.value = "";
            materialRef.current.value = "";
            sectionRef.current.value = "";
          }}
        >
          افزودن دسته بندی
        </Button>

        <TextField
          placeholder="جستجوی دسته بندی..."
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

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
      >
        <Table sx={{ "& *": { fontSize: "16px !important" } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>نام دسته بندی</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>مقطع</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>متریال</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>
                عملیات
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentGroupings.map((grouping) => (
              <TableRow key={grouping.ID} hover>
                <TableCell>{grouping.ID}</TableCell>
                <TableCell>{grouping.name}</TableCell>
                <TableCell>
                  {sections.find((s) => s.ID === grouping.section_id)?.name ||
                    "نامشخص"}
                </TableCell>
                <TableCell>
                  {materials.find((m) => m.ID === grouping.material_id)?.name ||
                    "نامشخص"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    sx={{
                      ...buttonBase,
                      backgroundColor: "#4096ff",
                      color: "#fff",
                      mr: 1,
                      "&:hover": { backgroundColor: "#1d72e8" },
                    }}
                    onClick={() => handleEditOpen(grouping)}
                  >
                    ویرایش
                  </Button>
                  <Button
                    sx={{
                      ...buttonBase,
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#e63946" },
                    }}
                    onClick={() => {
                      setOpenDelete(true);
                      setGroupingId(grouping.ID);
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
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ArrowBigRightDashIcon />
        </Button>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          variant="text"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <ArrowBigLeftDashIcon />
        </Button>
      </Box>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            دسته بندی جدید ایجاد کنید
          </Typography>

          {/* Name input */}
          <TextField
            label="نام دسته بندی"
            inputRef={nameRef}
            fullWidth
            sx={{ mb: 2 }}
            onKeyDown={(e) => e.key === "Enter" && handleAddGrouping()}
          />

          {/* Material select */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="material-label">متریال</InputLabel>
            <Select
              labelId="material-label"
              value={materialValue}
              onChange={(e) => setMaterialValue(e.target.value)}
            >
              <MenuItem value="">
                <em>انتخاب کنید</em>
              </MenuItem>
              {materials.map((mat) => (
                <MenuItem key={mat.ID} value={mat.ID}>
                  {mat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Section select */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="section-label">مقطع</InputLabel>
            <Select
              labelId="section-label"
              value={sectionValue}
              onChange={(e) => setSectionValue(e.target.value)}
            >
              <MenuItem value="">
                <em>انتخاب کنید</em>
              </MenuItem>
              {sections.map((sec) => (
                <MenuItem key={sec.ID} value={sec.ID}>
                  {sec.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Save button */}
          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleAddGrouping}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      <Modal open={openDelete} onClose={() => setOpenDelete(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            آیا از حذف خود اطمینان دارید؟
          </Typography>
          <Button
            sx={{
              ...buttonBase,
              m: 1,
              backgroundColor: "#1D72E8",
              color: "#fff",
            }}
            onClick={() => handleDeleteGrouping(groupingId)}
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

      <Modal open={openEdit} onClose={handleEditClose} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            دسته بندی را ویرایش کنید
          </Typography>
          <TextField
            label="نام دسته بندی"
            value={editData.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="material-edit-label">متریال</InputLabel>
            <Select
              labelId="material-edit-label"
              value={editData.material_id || ""}
              onChange={(e) =>
                setEditData({ ...editData, material_id: e.target.value })
              }
            >
              {materials.map((mat) => (
                <MenuItem key={mat.ID} value={mat.ID}>
                  {mat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="section-edit-label">مقطع</InputLabel>
            <Select
              labelId="section-edit-label"
              value={editData.section_id || ""}
              onChange={(e) =>
                setEditData({ ...editData, section_id: e.target.value })
              }
            >
              {sections.map((sec) => (
                <MenuItem key={sec.ID} value={sec.ID}>
                  {sec.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleUpdateGrouping}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Groupings;
