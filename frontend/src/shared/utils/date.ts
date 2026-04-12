export function formatDateTime(isoString: string) {
  return new Date(isoString).toLocaleString();
}
