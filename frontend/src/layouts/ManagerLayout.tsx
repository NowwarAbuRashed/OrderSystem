import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/store/auth-context';
import { LogOut, LayoutDashboard, Package, Archive, Tags } from 'lucide-react';
import clsx from 'clsx';

export function ManagerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/manager/orders', label: 'Orders', icon: Package },
    { to: '/manager/products', label: 'Products', icon: Archive },
    { to: '/manager/categories', label: 'Categories', icon: Tags },
    { to: '/manager/inventory', label: 'Inventory', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-4 bg-slate-950">
          <Link to="/manager/orders" className="text-xl font-bold text-white">Manager Portal</Link>
          <div className="text-xs text-slate-500 mt-1">{user?.fullName}</div>
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
                  isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
