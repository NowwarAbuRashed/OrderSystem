import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/store/auth-context';
import { useI18n } from '../app/i18n/i18n-context';
import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';
import { LogOut, Activity, AlertTriangle, Settings, Menu, X, LayoutDashboard, Users, ShoppingCart, DollarSign, ClipboardList, Package, FolderTree, ArrowRight } from 'lucide-react';
import { NotificationBell } from '../modules/admin/components/NotificationBell';
import clsx from 'clsx';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', label: t.admin.dashboard, icon: LayoutDashboard },
    { to: '/admin/users', label: t.admin.userManagement, icon: Users },
    { to: '/admin/orders', label: t.admin.orderOverview, icon: ShoppingCart },
    { to: '/admin/catalog', label: t.admin?.catalogOverview || 'Catalog', icon: Package },
    { to: '/admin/categories', label: t.nav?.categories || 'Categories', icon: FolderTree },
    { to: '/admin/revenue', label: t.admin.revenueReport, icon: DollarSign },
    { to: '/admin/activity', label: t.admin?.activityLog || 'Activity Log', icon: ClipboardList },
    { to: '/admin/inventory/status', label: t.nav.inventoryStatus, icon: Activity },
    { to: '/admin/inventory/low-stock', label: t.nav.lowStock, icon: AlertTriangle },
    { to: '/admin/manager-performance', label: t.admin?.managerPerformance || 'Manager Performance', icon: Users },
    { to: '/admin/settings', label: t.admin?.systemSettings || 'System Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-100">
        <Link to="/admin/inventory/status" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
            M
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">{t.nav.admin}</div>
          </div>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
            {user?.fullName?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="text-xs font-medium text-slate-500 truncate">{user?.fullName}</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={clsx("w-4 h-4", isActive ? "text-primary-600" : "text-slate-400")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {t.nav.manager}
        </div>
        <Link
          to="/manager/orders"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-primary-600 bg-primary-50 hover:bg-primary-100"
        >
          <ArrowRight className="w-4 h-4 text-primary-600" />
          {t.admin?.enterAsManager || 'Enter as Manager'}
        </Link>
      </div>
      <div className="p-3 border-t border-slate-100 space-y-1">
        <LanguageSwitcher className="w-full justify-start" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-danger-600 hover:bg-danger-50 rounded-xl w-full transition-all"
        >
          <LogOut className="w-4 h-4" /> {t.nav.logout}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/60 hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 start-0 w-72 bg-white shadow-2xl flex flex-col z-50">
            <div className="flex items-center justify-end p-3">
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200/60 px-4 h-14 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-primary-600 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-900 md:hidden">Marto</span>
            <span className="text-xs text-slate-400 font-medium md:hidden">{t.nav.admin}</span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
