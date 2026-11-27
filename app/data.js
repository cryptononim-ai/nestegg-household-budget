// NestEgg — seed data + state store.
// One household, two months. Every figure the site shows is computed from
// these rows, so the dashboard, budgets, goals and reports always agree.
// Money is in whole dollars. Amounts are positive; `kind` says the direction.

export const HOUSEHOLD = {
  name: 'The Alvarez Family',
  members: [
    { name: 'Maya Alvarez', role: 'Mum · Marketing lead', payday: '15th of the month', colour: '#1d4d3b' },
    { name: 'Daniel Alvarez', role: 'Dad · Electrician', payday: 'Last Friday', colour: '#e8a33d' },
    { name: 'Sofia Alvarez', role: 'Daughter · Age 8', payday: 'Pocket money Saturdays', colour: '#c96f4a' },
  ],
  currency: 'USD',
  months: ['2026-10', '2026-11'],
};

// November 2026 — the live month.
// Expenses sum to $2,792; savings transfers $620; income $4,850.
// Spent (money out) = 2792 + 620 = $3,412. Remaining = 4850 − 3412 = $1,438.
const NOV_EXPENSES = [
  // Housing — $1,450
  { day: 1, desc: 'November rent', cat: 'Housing', amount: 1450 },
  // Groceries — $520
  { day: 3, desc: 'Weekly shop — GreenMart', cat: 'Groceries', amount: 145 },
  { day: 8, desc: 'Weekly shop — GreenMart', cat: 'Groceries', amount: 98 },
  { day: 14, desc: 'Weekly shop — corner market', cat: 'Groceries', amount: 122 },
  { day: 21, desc: 'Weekly shop — GreenMart', cat: 'Groceries', amount: 87 },
  { day: 27, desc: 'Thanksgiving shop — GreenMart', cat: 'Groceries', amount: 68 },
  // Transport — $210
  { day: 2, desc: 'Bus passes (2)', cat: 'Transport', amount: 35 },
  { day: 4, desc: 'Fuel — Shell', cat: 'Transport', amount: 45 },
  { day: 11, desc: 'Fuel — Shell', cat: 'Transport', amount: 38 },
  { day: 18, desc: 'Fuel — BP', cat: 'Transport', amount: 52 },
  { day: 25, desc: 'Fuel — Shell', cat: 'Transport', amount: 40 },
  // Utilities — $195
  { day: 6, desc: 'Electric bill — City Power', cat: 'Utilities', amount: 78 },
  { day: 9, desc: 'Water + internet', cat: 'Utilities', amount: 64 },
  { day: 16, desc: 'Gas bill', cat: 'Utilities', amount: 53 },
  // Dining — $165
  { day: 7, desc: 'Pizza night — Luigi’s', cat: 'Dining', amount: 42 },
  { day: 13, desc: 'Lunch out — Maya & Daniel', cat: 'Dining', amount: 36 },
  { day: 20, desc: 'Takeaway — Thai Garden', cat: 'Dining', amount: 28 },
  { day: 22, desc: 'Family dinner — Olive House', cat: 'Dining', amount: 59 },
  // Kids — $120
  { day: 5, desc: 'School supplies', cat: 'Kids', amount: 55 },
  { day: 19, desc: 'Sofia’s new shoes', cat: 'Kids', amount: 65 },
  // Health — $82
  { day: 10, desc: 'Pharmacy — cold medicine', cat: 'Health', amount: 47 },
  { day: 24, desc: 'Dentist copay — Sofia', cat: 'Health', amount: 35 },
  // Fun — $50
  { day: 15, desc: 'Cinema — family film', cat: 'Fun', amount: 22 },
  { day: 26, desc: 'Streaming + game rental', cat: 'Fun', amount: 28 },
];

const NOV_SAVINGS = [
  { day: 1, desc: 'Transfer — Emergency fund', cat: 'Savings', amount: 400 },
  { day: 15, desc: 'Transfer — Family holiday', cat: 'Savings', amount: 150 },
  { day: 15, desc: 'Transfer — New fridge', cat: 'Savings', amount: 70 },
];

const NOV_INCOME = [
  { day: 15, desc: 'Maya — salary', cat: 'Income', amount: 3100 },
  { day: 27, desc: 'Daniel — salary', cat: 'Income', amount: 1450 },
  { day: 20, desc: 'Maya — freelance design', cat: 'Income', amount: 300 },
];

// October 2026 — the previous month, for the month switcher + trend chart.
// Expenses $2,940; savings $620; income $4,850; spent $3,560; remaining $1,290.
const OCT_EXPENSES = [
  { day: 1, desc: 'October rent', cat: 'Housing', amount: 1450 },
  { day: 4, desc: 'Weekly shop — GreenMart', cat: 'Groceries', amount: 150 },
  { day: 11, desc: 'Weekly shop — GreenMart', cat: 'Groceries', amount: 140 },
  { day: 18, desc: 'Weekly shop — corner market', cat: 'Groceries', amount: 160 },
  { day: 25, desc: 'Weekly shop — GreenMart', cat: 'Groceries', amount: 130 },
  { day: 6, desc: 'Fuel — Shell', cat: 'Transport', amount: 70 },
  { day: 13, desc: 'Fuel — BP', cat: 'Transport', amount: 60 },
  { day: 20, desc: 'Bus passes (2)', cat: 'Transport', amount: 60 },
  { day: 7, desc: 'Electric bill — City Power', cat: 'Utilities', amount: 80 },
  { day: 10, desc: 'Water + internet', cat: 'Utilities', amount: 70 },
  { day: 17, desc: 'Gas bill', cat: 'Utilities', amount: 60 },
  { day: 9, desc: 'Takeaway — Thai Garden', cat: 'Dining', amount: 60 },
  { day: 16, desc: 'Pizza night — Luigi’s', cat: 'Dining', amount: 55 },
  { day: 23, desc: 'Lunch out — Maya & Daniel', cat: 'Dining', amount: 55 },
  { day: 8, desc: 'School trip fee', cat: 'Kids', amount: 75 },
  { day: 21, desc: 'Art class materials', cat: 'Kids', amount: 65 },
  { day: 12, desc: 'Pharmacy — vitamins', cat: 'Health', amount: 60 },
  { day: 26, desc: 'Dentist check — Daniel', cat: 'Health', amount: 50 },
  { day: 14, desc: 'Cinema — family film', cat: 'Fun', amount: 45 },
  { day: 28, desc: 'Board game night', cat: 'Fun', amount: 45 },
];

const OCT_SAVINGS = [
  { day: 1, desc: 'Transfer — Emergency fund', cat: 'Savings', amount: 400 },
  { day: 15, desc: 'Transfer — Family holiday', cat: 'Savings', amount: 150 },
  { day: 15, desc: 'Transfer — New fridge', cat: 'Savings', amount: 70 },
];

const OCT_INCOME = [
  { day: 15, desc: 'Maya — salary', cat: 'Income', amount: 3100 },
  { day: 27, desc: 'Daniel — salary', cat: 'Income', amount: 1450 },
  { day: 22, desc: 'Maya — freelance design', cat: 'Income', amount: 300 },
];

export const CATEGORIES = [
  'Housing', 'Groceries', 'Transport', 'Utilities', 'Dining', 'Kids', 'Health', 'Fun',
];

export const CATEGORY_COLOURS = {
  Housing: '#1d4d3b', Groceries: '#4d8a5f', Transport: '#e8a33d', Utilities: '#c96f4a',
  Dining: '#8a6fb8', Kids: '#4a90c9', Health: '#c94a6b', Fun: '#a3a832',
};

// Monthly budget per category (November targets; October used the same targets).
export const BUDGETS = {
  Housing: 1450, Groceries: 600, Transport: 280, Utilities: 240,
  Dining: 200, Kids: 150, Health: 120, Fun: 100,
};

export const GOALS_SEED = [
  { id: 'emergency', name: 'Emergency fund', target: 5000, saved: 3150, note: 'Six months of rent, just in case.' },
  { id: 'holiday', name: 'Family holiday', target: 1800, saved: 940, note: 'A week by the sea next summer.' },
  { id: 'fridge', name: 'New fridge', target: 900, saved: 410, note: 'The old one hums louder every month.' },
];

// July–September trend (for the reports chart; October/November come from the rows above).
export const TREND_EARLIER = [
  { month: 'Jul', income: 4700, spent: 3350 },
  { month: 'Aug', income: 4700, spent: 3480 },
  { month: 'Sep', income: 4850, spent: 3290 },
];

export const MONTH_NAMES = { '2026-10': 'October 2026', '2026-11': 'November 2026' };

function buildMonth(key, expenses, savings, income) {
  const rows = [];
  let n = 0;
  const add = (list, kind) => {
    for (const t of list) {
      n += 1;
      rows.push({ id: `${key}-${n}`, month: key, kind, day: t.day, desc: t.desc, cat: t.cat, amount: t.amount });
    }
  };
  add(income, 'income');
  add(expenses, 'expense');
  add(savings, 'saving');
  rows.sort((a, b) => b.day - a.day || a.desc.localeCompare(b.desc));
  return { key, rows };
}

export const SEED_MONTHS = {
  '2026-11': buildMonth('2026-11', NOV_EXPENSES, NOV_SAVINGS, NOV_INCOME),
  '2026-10': buildMonth('2026-10', OCT_EXPENSES, OCT_SAVINGS, OCT_INCOME),
};

export const STORAGE_KEY = 'nestegg-v1';

export function freshState() {
  const months = {};
  for (const key of Object.keys(SEED_MONTHS)) {
    months[key] = { rows: SEED_MONTHS[key].rows.map((r) => ({ ...r })) };
  }
  return {
    month: '2026-11',
    months,
    budgets: { ...BUDGETS },
    goals: GOALS_SEED.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.months || !parsed.months['2026-11']) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — the site still works for this visit.
  }
}

// ---- summaries, always computed from the rows (never hard-coded) ----

export function monthSummary(state, key) {
  const rows = state.months[key].rows;
  let income = 0, expenses = 0, saved = 0;
  const byCat = {};
  for (const c of CATEGORIES) byCat[c] = 0;
  for (const r of rows) {
    if (r.kind === 'income') income += r.amount;
    else if (r.kind === 'expense') { expenses += r.amount; byCat[r.cat] = (byCat[r.cat] || 0) + r.amount; }
    else if (r.kind === 'saving') saved += r.amount;
  }
  const spent = expenses + saved;
  return { income, expenses, saved, spent, remaining: income - spent, byCat };
}

export function monthLabel(key) {
  return MONTH_NAMES[key] || key;
}
