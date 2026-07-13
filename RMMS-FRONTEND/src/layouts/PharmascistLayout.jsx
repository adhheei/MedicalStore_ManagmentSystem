import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const PharmacistLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col justify-between p-4">
        <div>
          <div className="text-xl font-bold text-emerald-400 mb-8 border-b border-emerald-800 pb-4">
            Rehana Medicals <span className="text-xs text-emerald-300 block font-normal">Pharmacy POS</span>
          </div>
          
          <nav className="space-y-2">
            <Link to="/pharmacist/dashboard" className="block px-4 py-2 rounded hover:bg-emerald-800">
              ⚡ POS / Billing
            </Link>
            <Link to="/pharmacist/inventory" className="block px-4 py-2 rounded hover:bg-emerald-800">
              📦 Inventory
            </Link>
            <Link to="/pharmacist/prescriptions" className="block px-4 py-2 rounded hover:bg-emerald-800">
              📋 Prescriptions
            </Link>
            <Link to="/pharmacist/suppliers" className="block px-4 py-2 rounded hover:bg-emerald-800">
              🚛 Suppliers
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="border-t border-emerald-800 pt-4">
          <p className="text-sm text-emerald-100 font-medium">{user?.name}</p>
          <p className="text-xs text-emerald-300 capitalize">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="w-full mt-3 bg-red-600 text-white text-xs font-semibold py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PharmacistLayout;