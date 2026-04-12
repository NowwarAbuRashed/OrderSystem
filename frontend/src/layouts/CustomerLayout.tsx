import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/store/auth-context';
import { LogOut, ShoppingCart, Package } from 'lucide-react';

export function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/products" className="text-xl font-bold text-primary-600">OrderSystem</Link>
            <nav className="hidden md:flex gap-4">
              <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Products</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/me/orders" className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-all">
              <Package className="w-5 h-5" />
            </Link>
            <Link to="/me/cart" className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-all">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <div className="hidden sm:block text-sm text-slate-700 font-medium px-2">
              {user?.fullName}
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
