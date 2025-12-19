import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout/Layout";
import api from "../api"; // your axios instance
import _ from "lodash";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newUsername, setNewUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");

  const itemsPerPage = 10;
  const nameRef = useRef();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.body);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ADD USER
  const handleAddUser = () => {
    const username = newUsername.trim();
    const password = newUserPassword.trim();
    if (!username || !password) {
      toast.error("نام کاربری و رمز عبور الزامی هستند");
      return;
    }

    api
      .post(
        "/users/role",
        { username: newUsername, password: newUserPassword, role: newUserRole },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        fetchUsers();
        setOpenAdd(false);
        setNewUsername("");
        setNewUserPassword("");
        setNewUserRole("user");
        toast.success("کاربر با موفقیت اضافه شد");
      })
      .catch((err) => {
        console.error(err);
        toast.error("مشکلی پیش آمد");
      });
  };

  // DELETE USER
  const handleDeleteUser = (id) => {
    api
      .patch(
        `/users/${id}`,
        { status: 0 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        fetchUsers();
        setOpenDelete(false);
        toast.success("کاربر با موفقیت غیرفعال شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمد");
        console.error(err);
      });
  };

  // EDIT USER
  const handleEditOpen = (user) => {
    setUserId(user.ID);
    setEditData(user);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditData({});
    setUserId("");
  };

  const handleUpdateUser = () => {
    if (!editData.username.trim()) return;

    const payload = {
      username: editData.username,
      role: editData.role,
    };
    api
      .put(`/users/${userId}`, payload)
      .then(() => {
        fetchUsers();
        handleEditClose();
        toast.success("کاربر با موفقیت ویرایش شد");
      })
      .catch((err) => {
        console.error(err);
        toast.error("مشکلی پیش آمد");
      });
  };

  // FILTER & PAGINATION
  const filteredUsers = _.filter(users, (user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const cardStyle = {
    mb: "12px",
    p: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      {/* HEADER */}
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
          افزودن کاربر
        </Button>

        <TextField
          placeholder="جستجوی کاربر..."
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

      {/* USER CARDS */}
      {currentUsers.map((user) => (
        <Card key={user.ID} sx={cardStyle}>
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
              {user.ID}
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontSize: "20px",
                fontWeight: 600,
                color: "#212529",
              }}
            >
              {user.username}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "#495057" }}>
              ({user.role})
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
                setUserId(user.ID);
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
              onClick={() => handleEditOpen(user)}
            >
              ویرایش
            </Button>
          </Box>
        </Card>
      ))}

      {/* PAGINATION */}
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

      {/* ADD USER MODAL */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            کاربر جدید ایجاد کنید
          </Typography>
          <TextField
            label="نام کاربری"
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="رمز عبور"
            type="password"
            fullWidth
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="نقش کاربر"
            select
            fullWidth
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            sx={{ mb: 2 }}
            SelectProps={{ native: true }}
          >
            <option value="super-admin">سوپر ادمین</option>
            <option value="shop-admin">ادمین فروشگاه</option>
            <option value="user">کاربر</option>
          </TextField>
          <Button
            sx={{
              ...buttonBase,
              backgroundColor: "#fb431a",
              color: "#fff",
              "&:hover": { backgroundColor: "#fb431a" },
            }}
            onClick={handleAddUser}
          >
            ذخیره
          </Button>
        </Box>
      </Modal>

      {/* DELETE USER MODAL */}
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
            onClick={() => handleDeleteUser(userId)}
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

      {/* EDIT USER MODAL */}
      <Modal open={openEdit} onClose={handleEditClose} keepMounted>
        <Box sx={modalBox}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            ویرایش کاربر
          </Typography>
          <TextField
            label="نام کاربری"
            fullWidth
            value={editData.username || ""}
            onChange={(e) =>
              setEditData({ ...editData, username: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="نقش کاربر"
            select
            fullWidth
            value={editData.role || "user"}
            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
            sx={{ mb: 2 }}
            SelectProps={{ native: true }}
          >
            <option value="super-admin">سوپر ادمین</option>

            <option value="shop-admin">ادمین فروشگاه</option>
            <option value="user">کاربر</option>
          </TextField>
          <Button
            sx={{
              ...buttonBase,
              backgroundColor: "#fb431a",
              color: "#fff",
              "&:hover": { backgroundColor: "#fb431a" },
            }}
            onClick={handleUpdateUser}
          >
            ویرایش
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Users;
