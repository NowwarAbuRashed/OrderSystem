import { useI18n } from '../../app/i18n/i18n-context';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-white border-t border-slate-200/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-lg font-bold text-slate-900">
                Marto
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              {t.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">{t.nav.products}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">
                  {t.products.catalog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">{t.footer.help}</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-slate-500">{t.footer.contact}</span>
              </li>
              <li>
                <span className="text-sm text-slate-500">{t.footer.privacy}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">{t.footer.about}</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-slate-500">{t.footer.terms}</span>
              </li>
              <li>
                <span className="text-sm text-slate-500">{t.footer.privacy}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {t.footer.copyright}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
