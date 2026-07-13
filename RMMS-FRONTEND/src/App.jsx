import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Inventory from "./pages/Pharmacist/Inventory"
import AdminInventory from "./pages/Admin/AdminInventory";;

// --- Temporary Mock Layouts ---
const AdminLayout = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Admin Portal</h1>
  </div>
);

const PharmacistLayout = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Pharmacist Portal</h1>
  </div>
);

const CustomerHome = () => (
  <h1 className="text-2xl font-bold p-8">Customer Storefront</h1>
);

const Unauthorized = () => (
  <div className="p-10 text-center text-red-600 font-bold text-xl">
    403 - Access Denied
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* TEMPORARY TEST ROUTE (Outside ProtectedRoute) */}
      <Route path="/pharmacist/inventory" element={<Inventory />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminLayout />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
      </Route>

      {/* Default Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
