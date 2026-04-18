export function ensureUtc(isoString: string) {
  if (!isoString) return '';
  return isoString.endsWith('Z') ? isoString : isoString + 'Z';
}

export function formatDateTime(isoString: string, options?: Intl.DateTimeFormatOptions) {
  if (!isoString) return '';
  return new Date(ensureUtc(isoString)).toLocaleString(undefined, options);
}

export function formatDate(isoString: string, options?: Intl.DateTimeFormatOptions) {
  if (!isoString) return '';
  return new Date(ensureUtc(isoString)).toLocaleDateString(undefined, options);
}
