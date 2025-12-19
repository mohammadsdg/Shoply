import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout/Layout";
import _ from "lodash";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Grid,
} from "@mui/material";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

function Sections() {
  const [sections, setSections] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [sectionId, setSectionId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // State for new section form
  const [newSection, setNewSection] = useState({
    name: "",
    params: 0,
    param_one: "",
    param_two: "",
    param_three: "",
  });

  // Fetch all sections
  const fetchSections = async () => {
    try {
      const res = await api.get("/sections");
      setSections(res.data.body);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت لیست مقاطع");
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Add new section
  const handleAddSection = () => {
    if (!newSection.name.trim() || !newSection.params) {
      toast.error("نام و تعداد پارامتر الزامی است");
      return;
    }

    api
      .post("/sections", newSection)
      .then(() => {
        fetchSections();
        setOpenAdd(false);
        setNewSection({
          name: "",
          params: 0,
          param_one: "",
          param_two: "",
          param_three: "",
        });
        toast.success("مقطع با موفقیت اضافه شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
        console.log(err);
      });
  };

  // Delete section
  const handleDeleteSection = (id) => {
    api
      .delete(`/sections/${id}`)
      .then(() => {
        fetchSections();
        setOpenDelete(false);
        toast.success("مقطع با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error(
          "مشکلی پیش آمد (احتمالا محصولی از این مقطع استفاده می‌کند)"
        );
        console.log(err);
      });
  };

  // Edit section
  const handleEditOpen = (section) => {
    setSectionId(section.ID);
    setEditData(section);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSectionId("");
    setEditData({});
  };

  const handleUpdateSection = () => {
    if (!editData.name.trim() || !editData.params) {
      toast.error("نام و تعداد پارامتر الزامی است");
      return;
    }

    api
      .put(`/sections/${sectionId}`, editData)
      .then(() => {
        fetchSections();
        handleEditClose();
        toast.success("مقطع با موفقیت ویرایش شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
        console.log(err);
      });
  };

  // Search + pagination
  const filteredSections = _.filter(sections, (section) =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSections = filteredSections.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);

  // Styles
  const cardStyle = {
    mb: "12px",
    p: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
    transition: "background 0.2s ease",
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
    width: 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Top bar */}
      <Box sx={{ display: "flex", gap: 2, mb: "1rem", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{
            ...buttonBase,
            backgroundColor: "#FB431A",
            color: "#fff",
            "&:hover": { backgroundColor: "#e33b17" },
            fontSize: "14px",
            p: "10px",
          }}
          onClick={() => setOpenAdd(true)}
        >
          افزودن مقطع
        </Button>

        <TextField
          placeholder="جستجوی مقطع..."
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

      {/* Sections List */}
      {currentSections.map((section) => (
        <Card key={section.ID} sx={cardStyle}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: "14px",
              p: "0 !important",
            }}
          >
            <Typography
              sx={{ fontWeight: 600, color: "#6c757d", fontSize: "16px" }}
            >
              #{section.ID}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#212529" }}
              >
                {section.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#495057" }}>
                تعداد پارامتر: {section.params}
              </Typography>
              <Typography variant="body2" sx={{ color: "#868e96" }}>
                {section.param_one || "-"} | {section.param_two || "-"} |{" "}
                {section.param_three || "-"}
              </Typography>
            </Box>
          </CardContent>

          <Box sx={{ display: "flex", gap: "12px" }}>
            <Button
              sx={{
                ...buttonBase,
                backgroundColor: "#ff4d4f",
                color: "#fff",
                "&:hover": { backgroundColor: "#e63946" },
              }}
              onClick={() => {
                setOpenDelete(true);
                setSectionId(section.ID);
              }}
            >
              حذف
            </Button>
            <Button
              sx={{
                ...buttonBase,
                backgroundColor: "#4096ff",
                color: "#fff",
                "&:hover": { backgroundColor: "#1d72e8" },
              }}
              onClick={() => handleEditOpen(section)}
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

      {/* Add Section Modal */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            مقطع جدید ایجاد کنید
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="نام"
                value={newSection.name}
                onChange={(e) =>
                  setNewSection({ ...newSection, name: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="تعداد پارامتر"
                type="number"
                value={newSection.params}
                onChange={(e) =>
                  setNewSection({
                    ...newSection,
                    params: Number(e.target.value),
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="پارامتر ۱"
                value={newSection.param_one}
                onChange={(e) =>
                  setNewSection({ ...newSection, param_one: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="پارامتر ۲"
                value={newSection.param_two}
                onChange={(e) =>
                  setNewSection({ ...newSection, param_two: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="پارامتر ۳"
                value={newSection.param_three}
                onChange={(e) =>
                  setNewSection({ ...newSection, param_three: e.target.value })
                }
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            sx={{
              ...buttonBase,
              mt: 2,
              backgroundColor: "#fb431a",
              color: "#fff",
            }}
            onClick={handleAddSection}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* Delete Section Modal */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            آیا از حذف این مقطع اطمینان دارید؟
          </Typography>
          <Button
            sx={{
              ...buttonBase,
              m: 1,
              backgroundColor: "#1D72E8",
              color: "#fff",
            }}
            onClick={() => handleDeleteSection(sectionId)}
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

      {/* Edit Section Modal */}
      <Modal open={openEdit} onClose={handleEditClose} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            ویرایش مقطع
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="نام"
                value={editData.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="تعداد پارامتر"
                type="number"
                value={editData.params || 0}
                onChange={(e) =>
                  setEditData({ ...editData, params: Number(e.target.value) })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="پارامتر ۱"
                value={editData.param_one || ""}
                onChange={(e) =>
                  setEditData({ ...editData, param_one: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="پارامتر ۲"
                value={editData.param_two || ""}
                onChange={(e) =>
                  setEditData({ ...editData, param_two: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="پارامتر ۳"
                value={editData.param_three || ""}
                onChange={(e) =>
                  setEditData({ ...editData, param_three: e.target.value })
                }
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            sx={{
              ...buttonBase,
              mt: 2,
              backgroundColor: "#fb431a",
              color: "#fff",
            }}
            onClick={handleUpdateSection}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Sections;
