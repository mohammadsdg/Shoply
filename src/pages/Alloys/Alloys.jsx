import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import _ from "lodash";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api";

function Alloys() {
  const [alloys, setAlloys] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [newAlloy, setNewAlloy] = useState({
    name: "",
    code: "",
    cutting_speed: "",
    material_id: "",
  });

  const [editData, setEditData] = useState({});
  const [selectedAlloyId, setSelectedAlloyId] = useState("");

  // Fetch alloys and materials
  const fetchAlloys = async () => {
    try {
      const res = await api.get("/alloys");
      setAlloys(res.data.body || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت آلیاژها");
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data.body || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت متریال‌ها");
    }
  };

  useEffect(() => {
    fetchAlloys();
    fetchMaterials();
  }, []);

  // Add Alloy
  const handleAddAlloy = async () => {
    const { name, code, cutting_speed, material_id } = newAlloy;
    if (!name || !code || !cutting_speed || !material_id) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }

    try {
      await api.post("/alloys", newAlloy);
      toast.success("آلیاژ با موفقیت اضافه شد");
      fetchAlloys();
      setOpenAdd(false);
      setNewAlloy({ name: "", code: "", cutting_speed: "", material_id: "" });
    } catch (err) {
      console.error(err);
      toast.error("مشکلی پیش آمد");
    }
  };

  // Edit Alloy
  const handleEditOpen = (alloy) => {
    setSelectedAlloyId(alloy.ID);
    setEditData(alloy);
    setOpenEdit(true);
  };

  const handleUpdateAlloy = async () => {
    if (
      !editData.name ||
      !editData.code ||
      !editData.cutting_speed ||
      !editData.material_id
    ) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }
    try {
      await api.put(`/alloys/${selectedAlloyId}`, editData);
      toast.success("آلیاژ با موفقیت ویرایش شد");
      fetchAlloys();
      setOpenEdit(false);
      setEditData({});
      setSelectedAlloyId("");
    } catch (err) {
      console.error(err);
      toast.error("مشکلی پیش آمد");
    }
  };

  // Delete Alloy
  const handleDeleteAlloy = async (id) => {
    try {
      await api.delete(`/alloys/${id}`);
      toast.success("آلیاژ با موفقیت حذف شد");
      fetchAlloys();
      setOpenDelete(false);
    } catch (err) {
      console.error(err);
      toast.error("مشکلی پیش آمد");
    }
  };

  // Filter and paginate
  const filteredAlloys = alloys.filter((alloy) => {
    const term = searchTerm.toLowerCase();
    const materialName =
      materials.find((m) => m.ID === alloy.material_id)?.name || "";
    const combined =
      `${alloy.name} ${alloy.code} ${alloy.cutting_speed} ${materialName}`.toLowerCase();
    return combined.includes(term);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlloys = filteredAlloys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlloys.length / itemsPerPage);

  const cardStyle = {
    mb: "12px",
    p: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
    "&:hover": { backgroundColor: "#dde2e8" },
  };

  const buttonBase = {
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "16px",
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
            fontSize: "15px",
          }}
          onClick={() => setOpenAdd(true)}
        >
          افزودن آلیاژ
        </Button>
        <TextField
          placeholder="جستجوی آلیاژ..."
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

      {currentAlloys.map((alloy) => (
        <Card key={alloy.ID} sx={cardStyle}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: "14px",
              p: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "#6c757d",
                fontSize: "16px",
                mx: "10px",
              }}
            >
              {alloy.ID}
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontSize: "20px",
                fontWeight: 600,
                color: "#212529",
              }}
            >
              {alloy.name} (کد: {alloy.code}, سرعت: {alloy.cutting_speed},
              متریال:{" "}
              {materials.find((m) => m.ID === alloy.material_id)?.name ||
                "نامشخص"}
              )
            </Typography>
          </CardContent>

          <Box sx={{ display: "flex", gap: "12px" }}>
            <Button
              sx={{ ...buttonBase, backgroundColor: "#ff4d4f", color: "#fff" }}
              onClick={() => {
                setSelectedAlloyId(alloy.ID);
                setOpenDelete(true);
              }}
            >
              حذف
            </Button>
            <Button
              sx={{ ...buttonBase, backgroundColor: "#4096ff", color: "#fff" }}
              onClick={() => handleEditOpen(alloy)}
            >
              ویرایش
            </Button>
          </Box>
        </Card>
      ))}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
        <Button
          variant="text"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <ArrowBigRightDashIcon />
        </Button>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
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
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            آلیاژ جدید ایجاد کنید
          </Typography>
          <TextField
            label="نام"
            value={newAlloy.name}
            onChange={(e) => setNewAlloy({ ...newAlloy, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="کد"
            value={newAlloy.code}
            onChange={(e) => setNewAlloy({ ...newAlloy, code: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="سرعت برش"
            value={newAlloy.cutting_speed}
            onChange={(e) =>
              setNewAlloy({ ...newAlloy, cutting_speed: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>متریال</InputLabel>
            <Select
              value={newAlloy.material_id}
              onChange={(e) =>
                setNewAlloy({ ...newAlloy, material_id: e.target.value })
              }
            >
              {materials.map((m) => (
                <MenuItem key={m.ID} value={m.ID}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleAddAlloy}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            ویرایش آلیاژ
          </Typography>
          <TextField
            label="نام"
            value={editData.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="کد"
            value={editData.code || ""}
            onChange={(e) => setEditData({ ...editData, code: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="سرعت برش"
            value={editData.cutting_speed || ""}
            onChange={(e) =>
              setEditData({ ...editData, cutting_speed: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>متریال</InputLabel>
            <Select
              value={editData.material_id || ""}
              onChange={(e) =>
                setEditData({ ...editData, material_id: e.target.value })
              }
            >
              {materials.map((m) => (
                <MenuItem key={m.ID} value={m.ID}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ ...buttonBase, backgroundColor: "#fb431a", color: "#fff" }}
            onClick={handleUpdateAlloy}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
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
            onClick={() => handleDeleteAlloy(selectedAlloyId)}
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
    </Layout>
  );
}

export default Alloys;
