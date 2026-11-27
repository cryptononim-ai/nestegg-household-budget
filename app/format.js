// NestEgg — formatting helpers. Plain functions, no dependencies.

export function money(n) {
  const sign = n < 0 ? '−' : '';
  return sign + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
}

export function moneySigned(n) {
  return (n < 0 ? '−$' : '+$') + Math.abs(Math.round(n)).toLocaleString('en-US');
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function dayLabel(monthKey, day) {
  const [y, m] = monthKey.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, day));
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
  return `${weekday} ${day}`;
}

export function csvCell(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
