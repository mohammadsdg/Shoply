import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout/Layout";
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
import api from "../api";

function Cutters() {
  const [cutters, setCutters] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Fields
  const [cutterId, setCutterId] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editTelephone, setEditTelephone] = useState("");

  const [shopId, setShopId] = useState();

  // Refs for new cutter
  const usernameRef = useRef();
  const telephoneRef = useRef();

  const itemsPerPage = 10;

  const userId = localStorage.getItem("user_id");

  const fetchShops = async () => {
    const res = await api.get("/shops");
    const data = res.data.body;

    const found = data.find((item) => item.user_id === Number(userId)).ID;

    setShopId(found);
  };
  // Fetch cutters
  const fetchCutters = async () => {
    try {
      const res = await api.get(`/cutters?shop_id=${shopId}`);
      setCutters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (shopId) {
      fetchCutters();
    }
  }, [shopId]);

  // Create cutter
  const handleAddCutter = () => {
    const username = usernameRef.current.value.trim();
    const telephone = telephoneRef.current.value.trim();
    const shop_id = shopId;

    if (!username || !telephone) {
      toast.error("تمام فیلدها را پر کنید");
      return;
    }

    api
      .post("/cutters", { username, telephone, shop_id })
      .then(() => {
        fetchCutters();
        handleClose();
        usernameRef.current.value = "";
        telephoneRef.current.value = "";
        toast.success("برش کار با موفقیت ایجاد شد");
      })
      .catch((err) => {
        console.log(err);
        toast.error("مشکلی پیش امد");
      });
  };

  // Delete cutter
  const handleDeleteCutter = (id) => {
    api
      .delete(`/cutters/${id}`)
      .then(() => {
        fetchCutters();
        handleDeleteClose();
        toast.success("برش کار با موفقیت حذف شد");
      })
      .catch((err) => {
        console.log(err);
        toast.error("مشکلی پیش امد");
      });
  };

  // Open edit modal
  const handleEditOpen = (id) => {
    setCutterId(id);
    const cutter = cutters.find((el) => el.ID === id);

    if (cutter) {
      setEditUsername(cutter.username);
      setEditTelephone(cutter.telephone);
    }

    setOpenEdit(true);
  };

  const handleUpdateCutter = () => {
    if (!editUsername.trim()) return;

    api
      .put(`/cutters/${cutterId}`, {
        id: cutterId,
        shop_id: shopId,
        username: editUsername,
        telephone: editTelephone,
      })
      .then(() => {
        toast.success("برش کار با موفقیت ویرایش شد");
        fetchCutters();
        handleEditClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("مشکلی پیش امد");
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDeleteOpen = (id) => {
    setOpenDelete(true);
    setCutterId(id);
  };
  const handleDeleteClose = () => setOpenDelete(false);
  const handleEditClose = () => {
    setOpenEdit(false);
    setCutterId("");
    setEditUsername("");
    setEditTelephone("");
  };

  // Search filter
  const filteredCutters = cutters.filter((c) =>
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCutters = filteredCutters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCutters.length / itemsPerPage);

  const CutterCard = ({ cutter }) => (
    <Card
      sx={{
        mb: "12px",
        p: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
      }}
    >
      <CardContent sx={{ display: "flex", gap: "14px", p: "0 !important" }}>
        <Typography sx={{ fontWeight: 600, mx: "10px" }}>
          {cutter.ID}
        </Typography>

        <Box>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
            {cutter.username}
          </Typography>
          <Typography sx={{ color: "#555" }}>
            تلفن: {cutter.telephone}
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ display: "flex", gap: "12px" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#ff4d4f" }}
          onClick={() => handleDeleteOpen(cutter.id)}
        >
          حذف
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4096ff" }}
          onClick={() => handleEditOpen(cutter.id)}
        >
          ویرایش
        </Button>
      </Box>
    </Card>
  );

  return (
    <Layout>
      <Toaster position="top-center" />

      <Box sx={{ display: "flex", gap: 2, mb: "1rem" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#FB431A" }}
          onClick={handleOpen}
        >
          افزودن برش کار
        </Button>

        <TextField
          placeholder="جستجوی برش کار..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          size="small"
          sx={{ minWidth: "90%" }}
        />
      </Box>

      {currentCutters.map((el) => (
        <CutterCard key={el.id} cutter={el} />
      ))}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <ArrowBigRightDashIcon />
        </Button>
        <Typography>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <ArrowBigLeftDashIcon />
        </Button>
      </Box>

      {/* Add Cutter Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            برش کار جدید ایجاد کنید
          </Typography>

          <TextField
            fullWidth
            label="نام کاربری"
            inputRef={usernameRef}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="تلفن"
            inputRef={telephoneRef}
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#fb431a" }}
            onClick={handleAddCutter}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={handleDeleteClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            آیا از حذف برش کار مطمئن هستید؟
          </Typography>

          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => handleDeleteCutter(cutterId)}
          >
            بله
          </Button>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            color="error"
            onClick={handleDeleteClose}
          >
            خیر
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEdit} onClose={handleEditClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            ویرایش برش کار
          </Typography>

          <TextField
            fullWidth
            label="نام کاربری"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="تلفن"
            value={editTelephone}
            onChange={(e) => setEditTelephone(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#fb431a" }}
            onClick={handleUpdateCutter}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

const modalStyle = {
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

export default Cutters;
