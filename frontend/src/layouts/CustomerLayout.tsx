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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/products" className="text-xl font-bold text-blue-600">OrderSystem</Link>
            <nav className="hidden md:flex gap-4">
              <Link to="/products" className="text-sm font-medium text-slate-700 hover:text-blue-600">Products</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/me/orders" className="text-slate-500 hover:text-blue-600">
              <Package className="w-5 h-5" />
            </Link>
            <Link to="/me/cart" className="text-slate-500 hover:text-blue-600">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <div className="text-sm text-slate-700 font-medium">
              {user?.fullName}
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100 transition-colors">
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
