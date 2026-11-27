// NestEgg — inline SVG charts. No libraries, no images, no network.
// Both builders return an SVG string; the site inlines it straight into the page.

import { money, pct } from './format.js';

// Donut of spending by category. Centre shows the total spent on expenses.
export function donut(byCat, colours, total) {
  const entries = Object.entries(byCat).filter(([, v]) => v > 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 0;
  let arcs = '';
  for (const [cat, value] of entries) {
    const frac = value / total;
    const len = frac * C;
    arcs += `<circle cx="90" cy="90" r="${R}" fill="none" stroke="${colours[cat] || '#999'}" stroke-width="26" stroke-dasharray="${len.toFixed(1)} ${(C - len).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
    offset += len;
  }
  let legend = '';
  for (const [cat, value] of entries) {
    legend += `<li><span class="swatch" style="background:${colours[cat] || '#999'}"></span>${cat}<b>${money(value)}</b><span class="muted">${pct(value, total)}%</span></li>`;
  }
  return `<div class="donut-wrap">
    <svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="Spending by category">
      <circle cx="90" cy="90" r="${R}" fill="none" stroke="#efe8d8" stroke-width="26" />
      ${arcs}
      <text x="90" y="84" text-anchor="middle" class="donut-total">${money(total)}</text>
      <text x="90" y="104" text-anchor="middle" class="donut-label">spent on bills &amp; food</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`;
}

// Grouped bar chart: income vs spent per month, Jul–Nov.
export function trendBars(points) {
  const W = 560;
  const H = 220;
  const top = 18;
  const bottom = 30;
  const max = Math.max(...points.map((p) => Math.max(p.income, p.spent))) * 1.08;
  const slot = W / points.length;
  const bw = 26;
  let bars = '';
  let labels = '';
  points.forEach((p, i) => {
    const x = i * slot + slot / 2;
    const ih = ((H - top - bottom) * p.income) / max;
    const sh = ((H - top - bottom) * p.spent) / max;
    bars += `<rect x="${(x - bw - 4).toFixed(1)}" y="${(H - bottom - ih).toFixed(1)}" width="${bw}" height="${ih.toFixed(1)}" rx="3" fill="#1d4d3b"><title>${p.month} income ${money(p.income)}</title></rect>`;
    bars += `<rect x="${(x + 4).toFixed(1)}" y="${(H - bottom - sh).toFixed(1)}" width="${bw}" height="${sh.toFixed(1)}" rx="3" fill="#e8a33d"><title>${p.month} spent ${money(p.spent)}</title></rect>`;
    labels += `<text x="${x.toFixed(1)}" y="${H - 10}" text-anchor="middle" class="bar-label">${p.month}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="trend-svg" role="img" aria-label="Monthly income versus spending">
    <line x1="0" y1="${H - bottom}" x2="${W}" y2="${H - bottom}" stroke="#d8cfb8" stroke-width="1" />
    ${bars}${labels}
  </svg>
  <p class="chart-key"><span class="key-dot" style="background:#1d4d3b"></span> Income &nbsp; <span class="key-dot" style="background:#e8a33d"></span> Spent</p>`;
}
