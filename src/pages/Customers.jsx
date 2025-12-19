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

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Fields
  const [customerId, setCustomerId] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editTelephone, setEditTelephone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const [shopId, setShopId] = useState();

  // Refs for new customer
  const usernameRef = useRef();
  const telephoneRef = useRef();
  const addressRef = useRef();

  const itemsPerPage = 10;

  const userId = localStorage.getItem("user_id");

  const fetchShops = async () => {
    const res = await api.get("/shops");
    const data = res.data.body;

    const found = data.find((item) => item.user_id === Number(userId)).ID;

    setShopId(found);
  };
  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?shop_id=${shopId}`);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (shopId) {
      fetchCustomers();
    }
  }, [shopId]);

  // Create customer
  const handleAddCustomer = () => {
    const username = usernameRef.current.value.trim();
    const telephone = telephoneRef.current.value.trim();
    const address = addressRef.current.value.trim();
    const shop_id = shopId;

    if (!username || !telephone || !address) {
      toast.error("تمام فیلدها را پر کنید");
      return;
    }

    api
      .post("/customers", { username, telephone, address, shop_id })
      .then(() => {
        fetchCustomers();
        handleClose();
        usernameRef.current.value = "";
        telephoneRef.current.value = "";
        addressRef.current.value = "";
        toast.success("فرد با موفقیت ایجاد شد");
      })
      .catch((err) => {
        console.log(err);
        toast.error("مشکلی پیش امد");
      });
  };

  // Delete customer
  const handleDeleteCustomer = (id) => {
    api
      .delete(`/customers/${id}`)
      .then(() => {
        fetchCustomers();
        handleDeleteClose();
        toast.success("فرد با موفقیت حذف شد");
      })
      .catch((err) => {
        console.log(err);
        toast.error("مشکلی پیش امد");
      });
  };

  // Open edit modal
  const handleEditOpen = (id) => {
    setCustomerId(id);
    const customer = customers.find((el) => el.ID === id);

    if (customer) {
      setEditUsername(customer.username);
      setEditTelephone(customer.telephone);
      setEditAddress(customer.address);
    }

    setOpenEdit(true);
  };

  const handleUpdateCustomer = () => {
    if (!editUsername.trim()) return;

    api
      .put(`/customers/${customerId}`, {
        id: customerId,
        shop_id: shopId,
        username: editUsername,
        telephone: editTelephone,
        address: editAddress,
      })
      .then(() => {
        toast.success("فرد با موفقیت ویرایش شد");
        fetchCustomers();
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
    setCustomerId(id);
  };
  const handleDeleteClose = () => setOpenDelete(false);
  const handleEditClose = () => {
    setOpenEdit(false);
    setCustomerId("");
    setEditUsername("");
    setEditTelephone("");
    setEditAddress("");
  };

  // Search filter
  const filteredCustomers = customers.filter((c) =>
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const CustomerCard = ({ customer }) => (
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
          {customer.ID}
        </Typography>

        <Box>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
            {customer.username}
          </Typography>
          <Typography sx={{ color: "#555" }}>
            تلفن: {customer.telephone}
          </Typography>
          <Typography sx={{ color: "#555" }}>
            آدرس: {customer.address}
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ display: "flex", gap: "12px" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#ff4d4f" }}
          onClick={() => handleDeleteOpen(customer.id)}
        >
          حذف
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4096ff" }}
          onClick={() => handleEditOpen(customer.id)}
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
          افزودن فرد
        </Button>

        <TextField
          placeholder="جستجوی فرد..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          size="small"
          sx={{ minWidth: "90%" }}
        />
      </Box>

      {currentCustomers.map((el) => (
        <CustomerCard key={el.id} customer={el} />
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

      {/* Add Customer Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            فرد جدید ایجاد کنید
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
          <TextField
            fullWidth
            label="آدرس"
            inputRef={addressRef}
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#fb431a" }}
            onClick={handleAddCustomer}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={handleDeleteClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            آیا از حذف فرد مطمئن هستید؟
          </Typography>

          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => handleDeleteCustomer(customerId)}
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
            ویرایش فرد
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
          <TextField
            fullWidth
            label="آدرس"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#fb431a" }}
            onClick={handleUpdateCustomer}
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

export default Customers;
