// NestEgg — bootstrap: load state, render the route, wire every control.
// All state lives in localStorage; every button and form on the site works.

import { CATEGORIES, freshState, loadState, saveState, monthLabel } from './data.js';
import { render, ROUTES } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');
const monthTag = document.getElementById('month-tag');
let state = loadState();

function navHtml() {
  const hash = location.hash || '#/';
  return ROUTES.map((r) => {
    const active = (hash === r.hash) || (hash === '' && r.hash === '#/') || (hash === '#' && r.hash === '#/');
    return `<a href="${r.hash}" ${active ? 'aria-current="page"' : ''}>${r.label}</a>`;
  }).join('');
}

function draw() {
  nav.innerHTML = navHtml();
  monthTag.textContent = monthLabel(state.month);
  app.innerHTML = render(state, location.hash || '#/');
  document.getElementById('year').textContent = String(new Date().getFullYear());
  window.scrollTo(0, 0);
}

function note(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function todayDay() {
  const d = new Date();
  return d.getDate();
}

function nextId() {
  let n = 0;
  for (const key of Object.keys(state.months)) {
    for (const r of state.months[key].rows) {
      const m = /^.*-(\d+)$/.exec(r.id);
      if (m) n = Math.max(n, Number(m[1]));
    }
  }
  return `custom-${n + 1}`;
}

// ---- form + button handling (one delegated listener) ----

document.addEventListener('submit', (e) => {
  const form = e.target;
  if (!(form instanceof HTMLFormElement)) return;
  e.preventDefault();
  const data = new FormData(form);

  if (form.id === 'quick-add') {
    const desc = String(data.get('desc') || '').trim();
    const cat = String(data.get('cat') || 'Groceries');
    const amount = Math.round(Number(data.get('amount')));
    if (!desc || !CATEGORIES.includes(cat) || !Number.isFinite(amount) || amount <= 0) {
      note('quick-add-note', 'Please fill in a description, a category and an amount over $0.');
      return;
    }
    state.months[state.month].rows.unshift({
      id: nextId(), month: state.month, kind: 'expense', day: todayDay(), desc, cat, amount,
    });
    saveState(state);
    draw();
    note('quick-add-note', `Added “${desc}” — $${amount} to ${cat}. The dashboard totals moved already.`);
    return;
  }

  if (form.id === 'tx-filter') {
    const q = new URLSearchParams();
    const cat = String(data.get('cat') || '');
    const text = String(data.get('q') || '').trim();
    const sort = String(data.get('sort') || 'new');
    if (cat) q.set('cat', cat);
    if (text) q.set('q', text);
    if (sort !== 'new') q.set('sort', sort);
    location.hash = '#/transactions' + (q.toString() ? '?' + q.toString() : '');
    return;
  }

  if (form.classList.contains('budget-edit')) {
    const cat = form.dataset.cat;
    const amount = Math.round(Number(data.get('amount')));
    if (!CATEGORIES.includes(cat) || !Number.isFinite(amount) || amount < 0) return;
    state.budgets[cat] = amount;
    saveState(state);
    draw();
    note('budget-note', `${cat} budget is now $${amount} a month — the dashboard and reports updated too.`);
    return;
  }

  if (form.classList.contains('goal-add')) {
    const goal = state.goals.find((g) => g.id === form.dataset.goal);
    const amount = Math.round(Number(data.get('amount')));
    if (!goal || !Number.isFinite(amount) || amount <= 0) return;
    goal.saved = Math.min(goal.target, goal.saved + amount);
    state.months[state.month].rows.unshift({
      id: nextId(), month: state.month, kind: 'saving', day: todayDay(),
      desc: `Transfer — ${goal.name}`, cat: 'Savings', amount,
    });
    saveState(state);
    draw();
    note('goal-note', `Moved $${amount} into “${goal.name}”. “Left to spend” fell by the same $${amount}.`);
  }
});

document.addEventListener('click', (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  const del = t.closest('[data-del]');
  if (del) {
    const id = del.dataset.del;
    const row = state.months[state.month].rows.find((r) => r.id === id);
    if (row && window.confirm(`Delete “${row.desc}” ($${row.amount})?`)) {
      state.months[state.month].rows = state.months[state.month].rows.filter((r) => r.id !== id);
      saveState(state);
      draw();
      note('tx-note', `Deleted “${row.desc}”. Totals updated.`);
    }
    return;
  }
  const edit = t.closest('[data-edit]');
  if (edit) {
    const id = edit.dataset.edit;
    const row = state.months[state.month].rows.find((r) => r.id === id);
    if (!row) return;
    const desc = window.prompt('Description:', row.desc);
    if (desc === null) return;
    const amount = window.prompt('Amount ($):', String(row.amount));
    if (amount === null) return;
    const n = Math.round(Number(amount));
    if (!desc.trim() || !Number.isFinite(n) || n <= 0) {
      note('tx-note', 'Edit cancelled — a transaction needs a description and an amount over $0.');
      return;
    }
    row.desc = desc.trim();
    row.amount = n;
    saveState(state);
    draw();
    note('tx-note', `Updated “${row.desc}” to $${row.amount}.`);
    return;
  }
  const monthBtn = t.closest('[data-month]');
  if (monthBtn) {
    state.month = monthBtn.dataset.month;
    saveState(state);
    draw();
    return;
  }
  if (t.id === 'reset-demo') {
    if (window.confirm('Reset everything to the Alvarez family’s original demo figures?')) {
      state = freshState();
      saveState(state);
      draw();
      note('household-note', 'Done — the original November and October figures are back.');
    }
  }
});

window.addEventListener('hashchange', draw);
draw();
