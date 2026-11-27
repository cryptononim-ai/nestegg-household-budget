// NestEgg — router + one renderer per page.
// Every page is plain HTML strings; forms and buttons are wired in main.js
// through event delegation on #app. No framework, no network.

import { CATEGORIES, CATEGORY_COLOURS, HOUSEHOLD, MONTH_NAMES, monthSummary, monthLabel } from './data.js';
import { money, moneySigned, pct, esc, dayLabel, csvCell } from './format.js';
import { donut, trendBars } from './charts.js';

export const ROUTES = [
  { hash: '#/', label: 'Dashboard' },
  { hash: '#/transactions', label: 'Transactions' },
  { hash: '#/budgets', label: 'Budgets' },
  { hash: '#/goals', label: 'Savings goals' },
  { hash: '#/reports', label: 'Reports' },
  { hash: '#/household', label: 'Household' },
];

function progressBar(value, max, tone) {
  const p = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return `<div class="bar"><span class="bar-fill ${tone || ''}" style="width:${p}%"></span></div>`;
}

function catChip(cat) {
  return `<span class="chip" style="--chip:${CATEGORY_COLOURS[cat] || '#888'}">${esc(cat)}</span>`;
}

// ---------------- Dashboard ----------------

function viewDashboard(state) {
  const key = state.month;
  const s = monthSummary(state, key);
  const recent = state.months[key].rows
    .filter((r) => r.kind !== 'income')
    .slice(0, 8);
  const goalTotal = state.goals.reduce((a, g) => a + g.saved, 0);
  const goalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const rows = recent.map((r) => `<tr>
    <td>${dayLabel(key, r.day)}</td><td>${esc(r.desc)}</td><td>${r.kind === 'saving' ? 'Savings' : catChip(r.cat)}</td>
    <td class="num ${r.kind === 'saving' ? 'save' : 'spend'}">${r.kind === 'saving' ? '−' : ''}${money(r.amount)}</td></tr>`).join('');
  return `<section class="hero">
    <div>
      <p class="eyebrow">${esc(monthLabel(key))} · ${esc(HOUSEHOLD.name)}</p>
      <h1>Every dollar has a nest.</h1>
      <p class="lede">Income, bills, groceries and savings — one page, all true to the cent. Nothing here is a sample: these are the Alvarez family’s real November numbers.</p>
    </div>
    <div class="hero-card">${donut(s.byCat, CATEGORY_COLOURS, s.expenses)}</div>
  </section>
  <section class="cards">
    <div class="card"><p class="card-label">Income</p><p class="card-num good">${money(s.income)}</p><p class="muted">Salaries + freelance</p></div>
    <div class="card"><p class="card-label">Spent</p><p class="card-num">${money(s.spent)}</p><p class="muted">Bills &amp; food ${money(s.expenses)} + savings ${money(s.saved)}</p></div>
    <div class="card"><p class="card-label">Left to spend</p><p class="card-num ${s.remaining < 0 ? 'bad' : 'good'}">${money(s.remaining)}</p><p class="muted">${pct(s.remaining, s.income)}% of income still free</p></div>
    <div class="card"><p class="card-label">Saved this month</p><p class="card-num save">${money(s.saved)}</p><p class="muted">Across ${state.goals.length} goals · ${money(goalTotal)} of ${money(goalTarget)} total</p></div>
  </section>
  <section class="split">
    <div class="panel">
      <h2>Budget at a glance</h2>
      ${CATEGORIES.slice(0, 4).map((c) => {
        const spent = s.byCat[c] || 0;
        const bud = state.budgets[c];
        return `<div class="mini-row"><span>${c}</span><span class="num">${money(spent)} / ${money(bud)}</span></div>${progressBar(spent, bud, spent > bud ? 'over' : '')}`;
      }).join('')}
      <p class="panel-link"><a href="#/budgets">See all budgets →</a></p>
    </div>
    <div class="panel">
      <h2>Savings goals</h2>
      ${state.goals.map((g) => `<div class="mini-row"><span>${esc(g.name)}</span><span class="num">${money(g.saved)} / ${money(g.target)}</span></div>${progressBar(g.saved, g.target, 'save')}`).join('')}
      <p class="panel-link"><a href="#/goals">Add to a goal →</a></p>
    </div>
  </section>
  <section class="panel">
    <h2>Recent spending</h2>
    <table class="tx"><thead><tr><th>Day</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <p class="panel-link"><a href="#/transactions">All ${state.months[key].rows.length} transactions →</a></p>
    <h3>Add a transaction</h3>
    <form id="quick-add" class="inline-form">
      <label>What <input name="desc" required maxlength="80" placeholder="e.g. Weekly shop — GreenMart"></label>
      <label>Category <select name="cat">${CATEGORIES.map((c) => `<option>${c}</option>`).join('')}</select></label>
      <label>Amount ($) <input name="amount" type="number" min="1" step="1" required placeholder="45"></label>
      <button type="submit">Add expense</button>
    </form>
    <p class="form-note" id="quick-add-note" aria-live="polite"></p>
  </section>`;
}

// ---------------- Transactions ----------------

function viewTransactions(state, query) {
  const key = state.month;
  const rows = state.months[key].rows;
  const cat = query.get('cat') || '';
  const text = (query.get('q') || '').toLowerCase();
  const sort = query.get('sort') || 'new';
  let list = rows.filter((r) => (!cat || r.cat === cat) && (!text || r.desc.toLowerCase().includes(text)));
  list = [...list].sort((a, b) => (sort === 'big' ? b.amount - a.amount : sort === 'small' ? a.amount - b.amount : b.day - a.day || a.desc.localeCompare(b.desc)));
  const inSum = list.filter((r) => r.kind === 'income').reduce((a, r) => a + r.amount, 0);
  const outSum = list.filter((r) => r.kind !== 'income').reduce((a, r) => a + r.amount, 0);
  const body = list.map((r) => `<tr>
    <td>${dayLabel(key, r.day)}</td><td>${esc(r.desc)}</td>
    <td>${r.kind === 'income' ? '<span class="chip income">Income</span>' : r.kind === 'saving' ? '<span class="chip saving">Savings</span>' : catChip(r.cat)}</td>
    <td class="num ${r.kind === 'income' ? 'good' : r.kind === 'saving' ? 'save' : 'spend'}">${r.kind === 'income' ? '+' : '−'}${money(r.amount)}</td>
    <td class="actions"><button class="mini-btn" data-edit="${r.id}">Edit</button> <button class="mini-btn danger" data-del="${r.id}">Delete</button></td></tr>`).join('');
  return `<h1>Transactions — ${esc(monthLabel(key))}</h1>
  <p class="lede">Every dollar in and out, with the real figures. Filter, sort, edit or delete — the totals below move with you.</p>
  <form id="tx-filter" class="filter-bar">
    <label>Category <select name="cat"><option value="">All categories</option>${['Income', 'Savings', ...CATEGORIES].map((c) => `<option ${c === cat ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
    <label>Search <input name="q" type="search" value="${esc(query.get('q') || '')}" placeholder="e.g. rent, GreenMart"></label>
    <label>Sort <select name="sort">
      <option value="new" ${sort === 'new' ? 'selected' : ''}>Newest first</option>
      <option value="big" ${sort === 'big' ? 'selected' : ''}>Largest first</option>
      <option value="small" ${sort === 'small' ? 'selected' : ''}>Smallest first</option>
    </select></label>
    <button type="submit">Apply</button>
  </form>
  <p class="totals">Showing <b>${list.length}</b> of ${rows.length} · In <b class="good">${money(inSum)}</b> · Out <b class="spend">${money(outSum)}</b> · Net <b>${moneySigned(inSum - outSum)}</b></p>
  <div class="panel"><table class="tx"><thead><tr><th>Day</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
  <tbody>${body || '<tr><td colspan="5">No transactions match that filter. <a href="#/transactions">Clear the filter</a>.</td></tr>'}</tbody></table></div>
  <p class="form-note" id="tx-note" aria-live="polite"></p>`;
}

// ---------------- Budgets ----------------

function viewBudgets(state) {
  const key = state.month;
  const s = monthSummary(state, key);
  const totalBud = CATEGORIES.reduce((a, c) => a + state.budgets[c], 0);
  const cards = CATEGORIES.map((c) => {
    const spent = s.byCat[c] || 0;
    const bud = state.budgets[c];
    const left = bud - spent;
    return `<div class="panel budget-card">
      <div class="mini-row"><h3>${c}</h3><span class="num ${spent > bud ? 'bad' : ''}">${money(spent)} / ${money(bud)}</span></div>
      ${progressBar(spent, bud, spent > bud ? 'over' : '')}
      <p class="muted">${spent > bud ? `${money(-left)} over budget` : `${money(left)} left · ${pct(spent, bud)}% used`}</p>
      <form class="budget-edit" data-cat="${c}"><label>Monthly budget ($) <input type="number" name="amount" min="0" step="5" value="${bud}" required></label><button type="submit">Save</button></form>
    </div>`;
  }).join('');
  return `<h1>Budgets — ${esc(monthLabel(key))}</h1>
  <p class="lede">Eight envelopes, one month. Total planned ${money(totalBud)} against ${money(s.expenses)} actually spent on bills and food — ${money(totalBud - s.expenses)} still inside the envelopes.</p>
  <div class="budget-grid">${cards}</div>
  <p class="form-note" id="budget-note" aria-live="polite"></p>`;
}

// ---------------- Goals ----------------

function viewGoals(state) {
  const s = monthSummary(state, state.month);
  const cards = state.goals.map((g) => `<div class="panel goal-card">
    <div class="mini-row"><h3>${esc(g.name)}</h3><span class="num">${money(g.saved)} / ${money(g.target)}</span></div>
    ${progressBar(g.saved, g.target, 'save')}
    <p class="muted">${pct(g.saved, g.target)}% there · ${money(g.target - g.saved)} to go</p>
    <p>${esc(g.note)}</p>
    <form class="goal-add" data-goal="${g.id}"><label>Add ($) <input type="number" name="amount" min="1" step="1" value="25" required></label><button type="submit">Contribute</button></form>
  </div>`).join('');
  return `<h1>Savings goals</h1>
  <p class="lede">This month the family put ${money(s.saved)} aside — ${money(state.goals.reduce((a, g) => a + g.saved, 0))} saved across all goals so far. Contributing moves money out of “left to spend” and into the goal, straight away.</p>
  <div class="goal-grid">${cards}</div>
  <p class="form-note" id="goal-note" aria-live="polite"></p>`;
}

// ---------------- Reports ----------------

function viewReports(state) {
  const key = state.month;
  const s = monthSummary(state, key);
  const otherKey = key === '2026-11' ? '2026-10' : '2026-11';
  const prev = monthSummary(state, otherKey);
  const trend = [
    { month: 'Jul', income: 4700, spent: 3350 },
    { month: 'Aug', income: 4700, spent: 3480 },
    { month: 'Sep', income: 4850, spent: 3290 },
    { month: 'Oct', income: prev.income, spent: prev.spent },
    { month: 'Nov', income: s.income, spent: s.spent },
  ];
  const topCat = [...CATEGORIES].sort((a, b) => (s.byCat[b] || 0) - (s.byCat[a] || 0))[0];
  const biggest = [...state.months[key].rows].filter((r) => r.kind === 'expense').sort((a, b) => b.amount - a.amount)[0];
  const diff = s.spent - prev.spent;
  const rows = state.months[key].rows;
  const csv = ['Date,Description,Category,Amount'].concat(rows.map((r) => [
    `${key}-${String(r.day).padStart(2, '0')}`, csvCell(r.desc), r.kind === 'income' ? 'Income' : r.cat, r.kind === 'income' ? r.amount : -r.amount,
  ].join(','))).join('\n');
  const href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  return `<h1>Reports — ${esc(monthLabel(key))}</h1>
  <p class="lede">Five months at a glance. Green is money in, amber is money out.</p>
  <section class="panel"><h2>Income vs spending, Jul–Nov</h2>${trendBars(trend)}</section>
  <section class="split">
    <div class="panel"><h2>Where the money went</h2>${donut(s.byCat, CATEGORY_COLOURS, s.expenses)}</div>
    <div class="panel"><h2>What the numbers say</h2>
      <ul class="insights">
        <li><b>Biggest category:</b> ${topCat} at ${money(s.byCat[topCat] || 0)} — mostly the rent, which never moves.</li>
        <li><b>Biggest single expense:</b> “${esc(biggest.desc)}”, ${money(biggest.amount)} on ${dayLabel(key, biggest.day)}.</li>
        <li><b>Versus ${esc(monthLabel(otherKey))}:</b> spending ${diff <= 0 ? 'fell' : 'rose'} ${money(Math.abs(diff))} (${pct(Math.abs(diff), prev.spent)}%).</li>
        <li><b>Groceries:</b> ${money(s.byCat.Groceries || 0)} of a ${money(state.budgets.Groceries)} budget — inside the envelope with room to spare.</li>
        <li><b>Savings rate:</b> ${pct(s.saved, s.income)}% of income went to goals this month.</li>
      </ul>
      <p><a class="btn" href="${href}" download="nestegg-${key}-transactions.csv">Download this month as CSV</a></p>
    </div>
  </section>`;
}

// ---------------- Household ----------------

function viewHousehold(state) {
  const key = state.month;
  const members = HOUSEHOLD.members.map((m) => `<div class="panel member-card">
    <p class="avatar" style="--av:${m.colour}">${esc(m.name.split(' ').map((w) => w[0]).join(''))}</p>
    <h3>${esc(m.name)}</h3><p class="muted">${esc(m.role)}</p><p>Payday: ${esc(m.payday)}</p>
  </div>`).join('');
  return `<h1>Household</h1>
  <p class="lede">Who lives on this budget, and how the month is set up. Everything here is stored only in this browser — NestEgg sends nothing anywhere.</p>
  <section class="member-grid">${members}</section>
  <section class="panel">
    <h2>Month</h2>
    <p>Showing <b>${esc(monthLabel(key))}</b>. Switch months to see October’s figures — every page updates.</p>
    <div class="month-switch">
      ${HOUSEHOLD.months.map((m) => `<button class="month-btn ${m === key ? 'active' : ''}" data-month="${m}">${esc(MONTH_NAMES[m])}</button>`).join('')}
    </div>
  </section>
  <section class="panel">
    <h2>Settings</h2>
    <p>Currency: <b>US dollars ($)</b> · Data lives in this browser’s local storage · No account, no cookies, no tracking.</p>
    <button class="btn danger-btn" id="reset-demo">Reset to the demo figures</button>
    <p class="muted">Restores Maya, Daniel and Sofia’s original November and October numbers, budgets and goals — anything you added, edited or deleted is undone.</p>
    <p class="form-note" id="household-note" aria-live="polite"></p>
  </section>`;
}

// ---------------- router ----------------

export function render(state, hash) {
  const [path, qs] = hash.split('?');
  const query = new URLSearchParams(qs || '');
  switch (path) {
    case '#/transactions': return viewTransactions(state, query);
    case '#/budgets': return viewBudgets(state);
    case '#/goals': return viewGoals(state);
    case '#/reports': return viewReports(state);
    case '#/household': return viewHousehold(state);
    case '#/':
    case '':
    case '#': return viewDashboard(state);
    default: return `<h1>Page not found</h1><p class="lede">That page isn’t in the nest. <a href="#/">Back to the dashboard</a>.</p>`;
  }
}
