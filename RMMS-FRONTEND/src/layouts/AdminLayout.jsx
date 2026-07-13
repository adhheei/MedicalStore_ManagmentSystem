import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
          <div className="text-xl font-bold text-blue-400 mb-8 border-b border-slate-700 pb-4">
            Rehana Medicals <span className="text-xs text-slate-400 block font-normal">Admin Portal</span>
          </div>
          
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-slate-800">
              📊 Dashboard
            </Link>
            <Link to="/admin/users" className="block px-4 py-2 rounded hover:bg-slate-800">
              👥 Manage Users
            </Link>
            <Link to="/admin/medicines" className="block px-4 py-2 rounded hover:bg-slate-800">
              💊 All Medicines
            </Link>
            <Link to="/admin/reports" className="block px-4 py-2 rounded hover:bg-slate-800">
              📈 Reports
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm text-slate-300 font-medium">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
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

export default AdminLayout;