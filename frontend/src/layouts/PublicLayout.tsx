import { Outlet, Link } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary-600">OrderSystem</Link>
          <nav>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Login</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
