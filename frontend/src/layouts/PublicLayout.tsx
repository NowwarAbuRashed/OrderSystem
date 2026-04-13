import { ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';
import { useI18n } from '../app/i18n/i18n-context';

interface PublicLayoutProps {
  children?: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-slate-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              M
            </div>
            <span className="text-xl font-bold text-slate-900">
              {t.brandFull}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children || <Outlet />}
      </main>
    </div>
  );
}
