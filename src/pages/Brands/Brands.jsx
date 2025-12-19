import React, { useEffect, useState, useRef, useMemo } from "react";
import Layout from "../../components/Layout/Layout";
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

import api from "../../api";

function Brands() {
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandId, setBrandId] = useState("");

  const itemsPerPage = 10;
  const brandRef = useRef();
  const editRef = useRef(null);

  const fetchBrands = async () => {
    try {
      const res = await api.get("/brands/");
      setBrands(res.data.body);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = () => {
    const userId = localStorage.getItem("user_id");
    const name = brandRef.current.value.trim();
    if (!name) return;
    api
      .post("/brands", { name, user_id: userId })
      .then(() => {
        fetchBrands();
        handleClose();
        brandRef.current.value = "";
        toast.success("برند با موفقیت ایجاد شد");
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteBrand = (id) => {
    api
      .delete(`/brands/${id}`)
      .then(() => {
        handleDeleteClose();
        toast.success("برند با موفقیت حذف شد");

        fetchBrands();
      })
      .catch((err) => console.log(err));
  };

  const handleEditOpen = (id) => {
    setBrandId(id);
    const brand = brands.find((el) => el.ID === id);
    if (brand) setEditName(brand.name);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setBrandId("");
    setEditName("");
  };

  const handleUpdateBrand = () => {
    if (!editName.trim()) return;
    api
      .put(`/brands/${brandId}`, {
        name: editName,
      })
      .then(() => {
        toast.success("برند با موفقیت ویرایش حذف شد");

        fetchBrands();
        handleEditClose();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!openEdit) return;
    const timer = setTimeout(() => {
      if (editRef.current) {
        editRef.current.focus();
        if (typeof editRef.current.select === "function")
          editRef.current.select();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [openEdit]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteOpen = (id) => {
    setOpenDelete(true);
    setBrandId(id);
  };
  const handleDeleteClose = () => setOpenDelete(false);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const BrandCard = React.memo(({ brand }) => (
    <Card
      sx={{
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
      }}
    >
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
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#6c757d",
            fontSize: "16px",
            mx: "10px",
          }}
        >
          {brand.ID}
        </Typography>
        <Typography
          variant="h6"
          sx={{ flex: 1, fontSize: "20px", fontWeight: 600, color: "#212529" }}
        >
          {brand.name}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", gap: "12px" }}>
        <Button
          variant="contained"
          sx={{
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "16px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "#e63946" },
          }}
          onClick={() => handleDeleteOpen(brand.ID)}
        >
          حذف
        </Button>
        <Button
          variant="contained"
          sx={{
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "16px",
            backgroundColor: "#4096ff",
            color: "#fff",
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "#1d72e8" },
          }}
          onClick={() => handleEditOpen(brand.ID)}
        >
          ویرایش
        </Button>
      </Box>
    </Card>
  ));

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <Box sx={{ display: "flex", gap: 2, mb: "1rem", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "16px",
            backgroundColor: "#FB431A",
            color: "#fff",
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "#e33b17" },
          }}
          onClick={handleOpen}
        >
          افزودن برند
        </Button>

        <TextField
          placeholder="جستجوی برند..."
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

      {currentBrands.map((el) => (
        <BrandCard key={el.ID} brand={el} />
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

      {/* Add Brand Modal */}
      <Modal open={open} onClose={handleClose} keepMounted>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            برند جدید ایجاد کنید
          </Typography>
          <TextField
            label="برند"
            variant="outlined"
            fullWidth
            inputRef={brandRef}
            sx={{ mb: 2 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddBrand();
              }
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fb431a",
              color: "#fff",
              "&:hover": { backgroundColor: "#fb431a" },
            }}
            onClick={handleAddBrand}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={handleDeleteClose} keepMounted>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            ایا از حذف خود اطمینان دارید؟
          </Typography>
          <Button
            variant="contained"
            sx={{
              m: 1,
              fontSize: "16px",
              backgroundColor: "#1D72E8",
              color: "#fff",
            }}
            onClick={() => handleDeleteBrand(brandId)}
          >
            بله
          </Button>
          <Button
            variant="contained"
            sx={{
              m: 1,
              fontSize: "16px",
              backgroundColor: "#ff6347",
              color: "#fff",
            }}
            onClick={handleDeleteClose}
          >
            خیر
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEdit} onClose={handleEditClose} keepMounted>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            برند را ویرایش کنید
          </Typography>
          <TextField
            label="برند"
            variant="outlined"
            fullWidth
            inputRef={editRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mb: 2 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUpdateBrand();
              }
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fb431a",
              color: "#fff",
              "&:hover": { backgroundColor: "#fb431a" },
            }}
            onClick={handleUpdateBrand}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Brands;
