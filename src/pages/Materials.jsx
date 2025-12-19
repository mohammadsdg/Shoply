import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout/Layout";
import api from "../api"; // use centralized axios instance
import _ from "lodash";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
} from "@mui/material";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const nameRef = useRef();

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data.body);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddMaterial = () => {
    const name = nameRef.current.value.trim();
    if (!name) return;

    api
      .post("/materials", { name })
      .then(() => {
        fetchMaterials();
        setOpen(false);
        nameRef.current.value = "";
        toast.success("متریال با موفقیت اضافه شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
          console.log(err)
      });
  };

  const handleDeleteMaterial = (id) => {
    api
      .delete(`/materials/${id}`)
      .then(() => {
        fetchMaterials();
        setOpenDelete(false);
        toast.success("متریال با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
        console.log(err);
      });
  };

  const handleEditOpen = (material) => {
    setMaterialId(material.ID);
    setEditData(material);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setMaterialId("");
    setEditData({});
  };

  const handleUpdateMaterial = () => {
    if (!editData.name.trim()) return;

    api
      .put(`/materials/${materialId}`, editData)
      .then(() => {
        fetchMaterials();
        handleEditClose();
        toast.success("متریال با موفقیت ویرایش شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
        console.log(err);
      });
  };

  const filteredMaterials = _.filter(materials, (material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

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
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  return (
    <>
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
              fontSize: "14px",
              p: "10px",
            }}
            onClick={() => setOpen(true)}
          >
            افزودن متریال
          </Button>

          <TextField
            placeholder="جستجوی متریال..."
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
        
        {currentMaterials.map((material) => (
          <Card key={material.ID} sx={cardStyle}>
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
                sx={{
                  fontWeight: 600,
                  color: "#6c757d",
                  fontSize: "16px",
                  mx: "10px",
                }}
              >
                
                #{material.ID}
              </Typography>
              
              <Typography
                sx={{
                  flex: 1,
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#212529",
                }}
              >
                {material.name}
              </Typography>
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
                  setMaterialId(material.ID);
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
                onClick={() => handleEditOpen(material)}
              >
                ویرایش
              </Button>
            </Box>
          </Card>
        ))}

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

        {/* Add Material Modal */}
        <Modal open={open} onClose={() => setOpen(false)} keepMounted>
          <Box sx={modalBox}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              متریال جدید ایجاد کنید
            </Typography>
            <TextField
              label="نام"
              inputRef={nameRef}
              fullWidth
              sx={{ mb: 2 }}
              onKeyDown={(e) => {
                e.key === "Enter" ? handleAddMaterial() : void 0;
              }}
            />
            <Button
              sx={{
                ...buttonBase,
                backgroundColor: "#fb431a",
                color: "#fff",
                "&:hover": { backgroundColor: "#fb431a" },
              }}
              onClick={handleAddMaterial}
            >
              ذخیره
            </Button>
          </Box>
        </Modal>

        {/* Delete Material Modal */}
        <Modal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          keepMounted
        >
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
              onClick={() => handleDeleteMaterial(materialId)}
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

        {/* Edit Material Modal */}
        <Modal open={openEdit} onClose={handleEditClose} keepMounted>
          <Box sx={modalBox}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              متریال را ویرایش کنید
            </Typography>
            <TextField
              label="نام"
              value={editData.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
              onKeyDown={(e) => {
                e.key === "Enter" ? handleUpdateMaterial() : void 0;
              }}
            />
            <Button
              sx={{
                ...buttonBase,
                backgroundColor: "#fb431a",
                color: "#fff",
                "&:hover": { backgroundColor: "#fb431a" },
              }}
              onClick={handleUpdateMaterial}
            >
              ویرایش
            </Button>
          </Box>
        </Modal>
      </Layout>
    </>
  );
}

export default Materials;
