import React, { useState } from "react";
import SidebarMenu from "../../components/Sidebar/SidebarMenu";
import SidebarItem from "../../components/Sidebar/SidebarItem";
import {
  LayoutDashboard,
  ShoppingBag,
  TagIcon,
  AnvilIcon,
  KanbanIcon,
  Section,
  ComponentIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArchiveIcon,
  ListCheckIcon,
  Menu as MenuIcon,
  UsersRoundIcon,
  ListOrderedIcon,
  Newspaper,
  WalletIcon,
} from "lucide-react";
import {
  Box,
  Menu,
  MenuItem,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const isMobile = useMediaQuery("(max-width: 900px)");

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    handleClose();
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleWalletRoute = () => {
    navigate("/wallet");
  };

  const sidebarContent = (
    <SidebarMenu>
      {role === "super-admin" && (
        <>
          <SidebarItem
            label="داشبورد"
            icon={<LayoutDashboard size={20} />}
            href="/dashboard"
          />
          <SidebarItem
            label="محصولات"
            icon={<ShoppingBag size={20} />}
            href="/products"
          />
          <SidebarItem
            label="برند"
            icon={<TagIcon size={20} />}
            href="/brands"
          />
          <SidebarItem
            label="الیاژ"
            icon={<AnvilIcon size={20} />}
            href="/alloys"
          />
          <SidebarItem
            label="متریال"
            icon={<KanbanIcon size={20} />}
            href="/materials"
          />
          <SidebarItem
            label="مقطع"
            icon={<Section size={20} />}
            href="/sections"
          />
          <SidebarItem
            label="دسته بندی"
            icon={<ComponentIcon size={20} />}
            href="/groupings"
          />
          <SidebarItem
            label="فروشگاه"
            icon={<ShoppingCartIcon size={20} />}
            href="/shops"
          />
          <SidebarItem
            label="کاربران"
            icon={<UsersIcon size={20} />}
            href="/users"
          />
        </>
      )}

      {role === "shop-admin" && (
        <>
          <SidebarItem
            label="درباره من"
            icon={<LayoutDashboard size={20} />}
            href="/about"
          />
          <SidebarItem
            label="محصولات"
            icon={<ShoppingCartIcon size={20} />}
            href="/shops"
          />
          <SidebarItem
            label="انبار"
            icon={<ArchiveIcon size={20} />}
            href="/storage"
          />
          <SidebarItem
            label="سفارش گذاری"
            icon={<ListCheckIcon size={20} />}
            href="/ordering"
          />
          <SidebarItem
            label="افراد"
            icon={<UsersRoundIcon size={20} />}
            href="/customers"
          />
          <SidebarItem
            label="برش کارها"
            icon={<UsersRoundIcon size={20} />}
            href="/cutters"
          />
          <SidebarItem
            label="پیش فاکتور"
            icon={<Newspaper size={20} />}
            href="/pre-invoices"
          />
        </>
      )}
      {role === "cutter" && (
        <SidebarItem
          label="سفارشات"
          icon={<ListOrderedIcon />}
          href="/income-orders"
        />
      )}
    </SidebarMenu>
  );

  return (
    <div className="layout-wrapper">
      {/* Sidebar for desktop */}
      {!isMobile && <div className="sidebar-menu">{sidebarContent}</div>}

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: 250 } }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="main-header">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            )}
            <div className="page-title">پنل مدیریت</div>
          </Box>

          <div className="user-info">
            <Button
              onClick={handleClick}
              sx={{ color: "#fff", textTransform: "none" }}
            >
              {role === "super-admin"
                ? "سوپر ادمین"
                : role === "shop-admin"
                ? "ادمین فروشگاه"
                : "کاربر"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleLogout}>خروج</MenuItem>
              <MenuItem onClick={handleWalletRoute}>کیف پول</MenuItem>
            </Menu>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
