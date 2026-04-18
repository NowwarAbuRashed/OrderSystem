const timezoneSuffixPattern = /(?:Z|[+-]\d{2}:\d{2})$/i;

export function ensureUtc(isoString: string) {
  if (!isoString) return '';
  return timezoneSuffixPattern.test(isoString) ? isoString : `${isoString}Z`;
}

export function formatDateTime(
  isoString: string,
  options?: Intl.DateTimeFormatOptions,
  locales?: Intl.LocalesArgument
) {
  if (!isoString) return '';
  return new Date(ensureUtc(isoString)).toLocaleString(locales, options);
}

export function formatDate(
  isoString: string,
  options?: Intl.DateTimeFormatOptions,
  locales?: Intl.LocalesArgument
) {
  if (!isoString) return '';
  return new Date(ensureUtc(isoString)).toLocaleDateString(locales, options);
}
