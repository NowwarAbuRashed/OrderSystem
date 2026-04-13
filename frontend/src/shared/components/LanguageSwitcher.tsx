import { useI18n } from '../../app/i18n/i18n-context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  const toggle = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
        text-slate-600 hover:text-primary-700 hover:bg-primary-50 transition-all ${className}`}
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span>{t.language.switchTo}</span>
    </button>
  );
}
