import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import toast, { Toaster } from "react-hot-toast";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";
import { Trash2, Edit2, PackageCheckIcon } from "lucide-react";
import api from "../api";
import _ from "lodash";

const modalBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "12px",
  p: 4,
};

const buttonBase = {
  borderRadius: "12px",
  textTransform: "none",
  px: 3,
  py: 1,
};

function Shops() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [userShop, setUserShop] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [shopId, setShopId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const nameRef = useRef();
  const phoneRef = useRef();

  // for creating shop
  // const [openAdd, setOpenAdd] = useState(false);
  const [addData, setAddData] = useState({ name: "", phone: "", user_id: "" });
  const [shopAdmins, setShopAdmins] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    setCurrentUser({ ID: userId, role });
    fetchShops(userId, role);
  }, []);

  // Fetch shop-admin users for select
  useEffect(() => {
    const fetchShopAdmins = async () => {
      try {
        const res = await api.get("/users");
        const admins = res.data.body.filter(
          (user) => user.role === "shop-admin"
        );
        setShopAdmins(admins);
      } catch (err) {
        console.error(err);
        toast.error("خطا در دریافت کاربران");
      }
    };
    fetchShopAdmins();
  }, []);

  // Handle creating shop
  const handleAddShop = async () => {
    if (!addData.name || !addData.phone || !addData.user_id) {
      toast.error("تمام فیلدها الزامی است");
      return;
    }

    try {
      const res = await api.post("/shops", addData);
      const newShop = res.data.body;
      toast.success("فروشگاه با موفقیت ایجاد شد");
      setOpenAdd(false);
      setAddData({ name: "", phone: "", user_id: "" });
      fetchShops(currentUser.ID, currentUser.role);
    } catch (err) {
      console.error(err);
      toast.error("مشکلی پیش آمد");
    }
  };

  // Fetch shops
  const fetchShops = async (userId, role) => {
    try {
      const res = await api.get("/shops");
      const allShops = res.data.body || [];
      setShops(allShops);

      if (role === "shop-admin") {
        const shop = allShops.find((s) => s.user_id == userId);
        if (shop) {
          setUserShop(shop);
          navigate(`/shops/${shop.ID}`); // redirect to view products
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت فروشگاه‌ها");
    }
  };

  // const handleAddShop = async () => {
  //   const name = nameRef.current.value.trim();
  //   const phone = phoneRef.current.value.trim();
  //   if (!name || !phone) {
  //     toast.error("تمام فیلدها الزامی است");
  //     return;
  //   }

  //   try {
  //     const res = await api.post("/shops", {
  //       name,
  //       phone,
  //       user_id: currentUser.ID,
  //     });

  //     const newShop = res.data.body; // assuming backend returns the created shop
  //     toast.success("فروشگاه با موفقیت ایجاد شد");
  //     setOpenAdd(false);

  //     if (newShop && newShop.ID) {
  //       navigate(`/shops/${newShop.ID}`); // ✅ use shop ID, not user ID
  //     } else {
  //       // fallback: refresh list if backend doesn’t return shop directly
  //       fetchShops(currentUser.ID, currentUser.role);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("مشکلی پیش آمد");
  //   }
  // };

  // Edit shop (super-admin only)
  const handleEditOpen = (shop) => {
    setShopId(shop.ID);
    setEditData(shop);
    setOpenEdit(true);
  };

  const handleUpdateShop = async () => {
    if (!editData.name || !editData.phone) {
      toast.error("تمام فیلدها الزامی است");
      return;
    }

    try {
      await api.put(`/shops/${shopId}`, editData);
      toast.success("فروشگاه با موفقیت ویرایش شد");
      setOpenEdit(false);
      fetchShops(currentUser.ID, currentUser.role);
    } catch (err) {
      console.error(err);
      toast.error("مشکلی پیش آمد");
    }
  };

  // Delete shop (super-admin only)
  const handleDeleteShop = async (id) => {
    if (!window.confirm("آیا مطمئنید؟")) return;
    try {
      await api.delete(`/shops/${id}`);
      toast.success("فروشگاه حذف شد");
      fetchShops(currentUser.ID, currentUser.role);
    } catch (err) {
      console.error(err);
      toast.error("مشکلی پیش آمد");
    }
  };

  // Filter + pagination for super-admin
  const filteredShops = _.filter(shops, (shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentShops = filteredShops.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);

  return (
    <Layout>
      <Toaster position="top-center" />

      {/* Shop-admin without shop */}
      {/* {currentUser?.role === "shop-admin" && !userShop && (
        <Box sx={{ p: 3 }}>
          <Button
            variant="contained"
            sx={{ ...buttonBase, backgroundColor: "#FB431A", color: "#fff" }}
            onClick={() => setOpenAdd(true)}
          >
            ایجاد فروشگاه
          </Button>

          <Modal open={openAdd} onClose={() => setOpenAdd(false)} keepMounted>
            <Box sx={modalBox}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                فروشگاه جدید ایجاد کنید
              </Typography>
              <TextField
                label="نام فروشگاه"
                inputRef={nameRef}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="شماره تلفن"
                inputRef={phoneRef}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                sx={{
                  ...buttonBase,
                  backgroundColor: "#fb431a",
                  color: "#fff",
                }}
                onClick={handleAddShop}
              >
                ذخیره
              </Button>
            </Box>
          </Modal>
        </Box>
      )} */}

      {/* Super-admin shop list */}
      {currentUser?.role === "super-admin" && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            همه فروشگاه‌ها
          </Typography>

          <TextField
            placeholder="جستجو..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ mb: 2, width: "100%" }}
          />

          {/* Add Shop Modal & Button */}
          <Button
            variant="contained"
            sx={{
              ...buttonBase,
              backgroundColor: "#FB431A",
              color: "#fff",
              "&:hover": { backgroundColor: "#e33b17" },
              fontSize: "14px",
              p: "10px",
              mb: 2,
            }}
            onClick={() => setOpenAdd(true)}
          >
            افزودن فروشگاه
          </Button>

          <Modal open={openAdd} onClose={() => setOpenAdd(false)} keepMounted>
            <Box sx={modalBox}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                ایجاد فروشگاه جدید
              </Typography>

              <TextField
                label="نام فروشگاه"
                fullWidth
                sx={{ mb: 2 }}
                value={addData.name}
                onChange={(e) =>
                  setAddData({ ...addData, name: e.target.value })
                }
              />

              <TextField
                label="شماره تلفن"
                fullWidth
                sx={{ mb: 2 }}
                value={addData.phone}
                onChange={(e) =>
                  setAddData({ ...addData, phone: e.target.value })
                }
              />

              <TextField
                select
                label="انتخاب مدیر فروشگاه"
                fullWidth
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
                value={addData.ID}
                onChange={(e) =>
                  setAddData({ ...addData, user_id: e.target.value })
                }
              >
                {/* <option value="">انتخاب کنید</option> */}
                {shopAdmins.map((admin) => (
                  <option key={admin.ID} value={admin.ID}>
                    {admin.username}
                  </option>
                ))}
              </TextField>

              <Button
                sx={{
                  ...buttonBase,
                  backgroundColor: "#fb431a",
                  color: "#fff",
                }}
                onClick={handleAddShop}
              >
                ذخیره
              </Button>
            </Box>
          </Modal>

          {currentShops.map((shop) => (
            <Card
              key={shop.ID}
              sx={{
                mb: 2,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle1">{shop.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {shop.phone}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  sx={{ backgroundColor: "#ff9640ff", color: "#fff" }}
                  onClick={() => navigate(`/shops/${shop.ID}`)}
                  startIcon={<PackageCheckIcon />}
                >
                  محصولات
                </Button>

                <Button
                  sx={{ backgroundColor: "#4096ff", color: "#fff" }}
                  onClick={() => handleEditOpen(shop)}
                  startIcon={<Edit2 />}
                >
                  ویرایش
                </Button>
                <Button
                  sx={{ backgroundColor: "#ff4d4f", color: "#fff" }}
                  onClick={() => handleDeleteShop(shop.ID)}
                  startIcon={<Trash2 />}
                >
                  حذف
                </Button>
              </Box>
            </Card>
          ))}

          {/* Pagination */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}
          >
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ArrowBigRightDashIcon />
            </Button>
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              {currentPage} / {totalPages}
            </Typography>
            <Button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ArrowBigLeftDashIcon />
            </Button>
          </Box>

          {/* Edit Shop Modal */}
          <Modal open={openEdit} onClose={() => setOpenEdit(false)} keepMounted>
            <Box sx={modalBox}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                ویرایش فروشگاه
              </Typography>
              <TextField
                label="نام فروشگاه"
                fullWidth
                sx={{ mb: 2 }}
                value={editData.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <TextField
                label="شماره تلفن"
                fullWidth
                sx={{ mb: 2 }}
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
              <Button
                sx={{
                  ...buttonBase,
                  backgroundColor: "#fb431a",
                  color: "#fff",
                }}
                onClick={handleUpdateShop}
              >
                ذخیره
              </Button>
            </Box>
          </Modal>
        </Box>
      )}
    </Layout>
  );
}

export default Shops;
