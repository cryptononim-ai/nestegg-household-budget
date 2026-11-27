# NestEgg — Household Budget

[![make.fun](https://img.shields.io/badge/make.fun-best--household--budget--site-1d4d3b)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

**NestEgg** is the Alvarez family’s household budget site: income, spending,
budgets, savings goals and reports for one real household, all in one place —
and every number on it is true to the cent.

Maya & Daniel Alvarez, one daughter, November 2026. Monthly income $4,850
(salaries + freelance). Spent $3,412, saved $620, $1,438 left to spend. Every
figure on every page is computed from the same transaction rows, so the
dashboard, budgets, goals and reports can never disagree with each other.

## What it does

- **Dashboard** — month summary cards, spending donut, budget and goal
  progress, recent transactions, and a quick-add form that really adds.
- **Transactions** — all 30 November rows (plus October’s 26), filterable by
  category, searchable, sortable, editable inline and deletable with confirm.
  Totals move with the filter.
- **Budgets** — eight monthly envelopes with spent-vs-budget bars and
  over/under amounts; every budget amount is editable and updates everywhere.
- **Savings goals** — emergency fund, family holiday, new fridge; contributing
  moves money out of “left to spend” and into the goal at once.
- **Reports** — income-vs-spending bars Jul–Nov, category breakdown, plain
  insights (biggest category, biggest expense, vs last month), and a real
  CSV download of the month.
- **Household** — the three family members, payday info, an October/November
  month switcher that changes every figure, and a reset-to-demo button.

Everything is stored only in the browser (localStorage). No account, no
cookies, no service worker, no network request, no `eval`. Static files under
`app/`, no build step — open `app/index.html` from any static server.

## Run it

```sh
node serve.ts            # http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.

## Entry

Built for the make.fun bounty **“Make the best household budget site”**
(`best-household-budget-site-20261126-1457`), $50 shared by the top 10.
