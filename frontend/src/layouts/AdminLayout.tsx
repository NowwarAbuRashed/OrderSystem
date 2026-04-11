import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/store/auth-context';
import { LogOut, Activity, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/inventory/status', label: 'Inventory Status', icon: Activity },
    { to: '/admin/inventory/low-stock', label: 'Low Stock Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-red-950 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-4 bg-red-900">
          <Link to="/admin/inventory/status" className="text-xl font-bold text-white">Admin Portal</Link>
          <div className="text-xs text-red-300 mt-1">{user?.fullName}</div>
        </div>
        <nav className="flex-1 p-2 space-y-1 mt-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-red-900 text-white" : "hover:bg-red-900/50 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
