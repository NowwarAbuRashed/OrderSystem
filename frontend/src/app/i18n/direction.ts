import type { Locale } from './messages/en';

export type Direction = 'ltr' | 'rtl';

export function getDirection(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}
