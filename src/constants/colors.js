export const CITY_COLORS = {
  Delhi: '#3b82f6',
  Mumbai: '#6d28d9',
  Pune: '#f43f5e',
  Bengaluru: '#0f766e',
  Chennai: '#0284c7',
  Hyderabad: '#ea580c',
  Ahmedabad: '#d97706',
  Kolkata: '#16a34a',
  Jaipur: '#dc2626',
  Lucknow: '#7c3aed',
};

export function brightenColor(hex, amount = 0.15) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount);
  const b = Math.min(255, (num & 0xff) + 255 * amount);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
