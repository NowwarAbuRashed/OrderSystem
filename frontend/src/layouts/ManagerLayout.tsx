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
      <aside className="w-64 bg-white border-r border-slate-200/60 hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/manager/orders" className="text-xl font-bold text-primary-600">Manager Portal</Link>
          <div className="text-xs font-medium text-slate-500 mt-1">{user?.fullName}</div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={clsx("w-4 h-4", isActive ? "text-primary-600" : "text-slate-400")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200/60">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-all">
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
