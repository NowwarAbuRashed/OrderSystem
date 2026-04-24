import { Link } from 'react-router-dom';
import { useI18n } from '../../../app/i18n/i18n-context';
import { AlertCircle } from 'lucide-react';
import { PublicLayout } from '../../../layouts/PublicLayout';

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-8rem)] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
          404 - {t.errors.notFound}
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
          {t.errors.notFoundDesc}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          {t.errors.backHome}
        </Link>
      </div>
    </PublicLayout>
  );
}
