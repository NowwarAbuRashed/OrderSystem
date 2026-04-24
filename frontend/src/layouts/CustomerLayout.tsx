import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/store/auth-context';
import { useI18n } from '../app/i18n/i18n-context';
import { useCartQuery } from '../modules/cart/hooks/useCart';
import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';
import { Footer } from '../shared/components/Footer';
import { LogOut, ShoppingCart, Package, Settings, Menu, X, Search } from 'lucide-react';

export function CustomerLayout() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data: cart } = useCartQuery();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart?.items?.length || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link to="/products" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                M
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">Marto</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/products"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                {t.nav.products}
              </Link>
              <Link
                to="/me/orders"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                {t.nav.orders}
              </Link>
            </nav>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-lg hidden lg:block">
            <form 
              className="relative" 
              onSubmit={(e) => {
                e.preventDefault();
                const search = new FormData(e.currentTarget).get('search') as string;
                if (search) {
                  navigate(`/products?search=${encodeURIComponent(search)}`);
                } else {
                  navigate('/products');
                }
              }}
            >
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors z-10">
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                name="search"
                placeholder={t.products.searchPlaceholder}
                className="w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-sm text-slate-900 bg-slate-50 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:inline-flex" />

            <Link
              to="/me/orders"
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all hidden md:flex"
              title={t.nav.orders}
            >
              <Package className="w-5 h-5" />
            </Link>

            <Link
              to="/me/cart"
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative"
              title={t.nav.cart}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            <Link
              to="/me/settings"
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all hidden md:flex"
              title={t.nav.settings}
            >
              <Settings className="w-5 h-5" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
                {user?.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-slate-700 font-medium hidden lg:block max-w-[120px] truncate">
                {user?.fullName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-danger-600 rounded-xl hover:bg-danger-50 transition-all hidden sm:flex"
              title={t.nav.logout}
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg">
            <nav className="px-4 py-3 space-y-1">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all"
              >
                <Search className="w-4 h-4" />
                {t.nav.products}
              </Link>
              <Link
                to="/me/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all"
              >
                <Package className="w-4 h-4" />
                {t.nav.orders}
              </Link>
              <Link
                to="/me/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                {t.nav.cart}
                {cartItemCount > 0 && (
                  <span className="ml-auto bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link
                to="/me/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all"
              >
                <Settings className="w-4 h-4" />
                {t.nav.settings}
              </Link>
              <div className="pt-2 border-t border-slate-100 mt-2">
                <LanguageSwitcher className="w-full justify-start" />
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-danger-600 hover:bg-danger-50 rounded-lg w-full transition-all"
              >
                <LogOut className="w-4 h-4" />
                {t.nav.logout}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
