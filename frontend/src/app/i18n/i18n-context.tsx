import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { en, type TranslationMessages, type Locale } from './messages/en';
import { ar } from './messages/ar';
import { getDirection, type Direction } from './direction';

const messages: Record<Locale, TranslationMessages> = { en, ar };

type I18nContextType = {
  locale: Locale;
  dir: Direction;
  t: TranslationMessages;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'marto_locale';

function getSavedLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // Ignored
  }
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);

  const dir = getDirection(locale);
  const t = messages[locale];

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  // Apply dir attribute to <html> element
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', locale);
  }, [locale, dir]);

  return (
    <I18nContext.Provider value={{ locale, dir, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
