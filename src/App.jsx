import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import About from "./pages/About";
import LoginForm from "./pages/LoginForm/LoginForm";
import RegisterForm from "./pages/RegisterForm/RegisterForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductManager from "./components/ProductManager/ProductManager";
import Brands from "./pages/Brands/Brands";
import Alloys from "./pages/Alloys/Alloys";
import Materials from "./pages/Materials";
import Sections from "./pages/Sections";
import Groupings from "./pages/Groupings";
import Shops from "./pages/Shops";
import ShopDetails from "./pages/ShopDetails";
import ProductSizes from "./pages/ProductsSizes";
import PublicRoute from "./components/PublicRoute";
import { AnimatePresence } from "framer-motion";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Users from "./pages/Users";
import Storage from "./pages/Storage";
import Ordering from "./pages/Ordering";
import Pending from "./pages/Pending";
import Approved from "./pages/Approved";
import Customers from "./pages/Customers";
import PreInvoices from "./pages/PreInvoices";
import Cutters from "./pages/Cutters";
import Wallet from "./pages/Wallet";
import CuttersPreInvoices from "./pages/CuttersPreInvoices";
import Invoices from "./pages/Invoices";

function MoviesPage() {
  window.location.replace("/movies.html");
  return null;
}

function App() {
  const location = useLocation();
  const isAuthenticated = () => !!localStorage.getItem("token");

  return (
    <div className="bg-[#ffe8e0]">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Check for user be login */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />

          {/* ! THIS ROUTE SHALL BE DELETED SOON */}

          <Route path="/movies" element={<MoviesPage />} />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute>
                <Dashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <RoleProtectedRoute>
                <About />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <RoleProtectedRoute>
                <ProductManager />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/brands"
            element={
              <RoleProtectedRoute>
                <Brands />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/alloys"
            element={
              <RoleProtectedRoute>
                <Alloys />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <RoleProtectedRoute>
                <Materials />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sections"
            element={
              <RoleProtectedRoute>
                <Sections />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/groupings"
            element={
              <RoleProtectedRoute>
                <Groupings />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/shops"
            element={
              <RoleProtectedRoute>
                <Shops />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sizes"
            element={
              <RoleProtectedRoute>
                <ProductSizes />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/shops/:shopId"
            element={
              <RoleProtectedRoute>
                <ShopDetails />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/storage"
            element={
              <RoleProtectedRoute allowedRoles={"shop-admin"}>
                <Storage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/pending"
            element={
              <RoleProtectedRoute allowedRoles={"shop-admin"}>
                <Pending />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/approved"
            element={
              <RoleProtectedRoute>
                <Approved />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/ordering"
            element={
              <RoleProtectedRoute>
                <Ordering />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <RoleProtectedRoute>
                <Users />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <RoleProtectedRoute allowedRoles={"shop-admin"}>
                <Customers />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/pre-invoices"
            element={
              <RoleProtectedRoute allowedRoles={"shop-admin"}>
                <PreInvoices />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/cutters"
            element={
              <RoleProtectedRoute allowedRoles={"shop-admin"}>
                <Cutters />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/income-orders"
            element={
              <RoleProtectedRoute allowedRoles={"cutter"}>
                <CuttersPreInvoices />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <RoleProtectedRoute allowedRoles={"shop-admin"}>
                <Wallet />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/main-invoices"
            element={
              <RoleProtectedRoute allowedRoles={"shop-admin"}>
                <Invoices />
              </RoleProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
