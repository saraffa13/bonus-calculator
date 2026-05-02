# Bonus Calculator

A Next.js 14 (App Router) + SQLite app for calculating the effective per-unit
price under "Buy X Get Y Free" deals.

> Buy 3 Get 3 Free at ₹300 → ₹300 / 6 = **₹50 per unit**

## Stack

- Next.js 14 (App Router) + TypeScript
- SQLite via `better-sqlite3` (synchronous)
- Tailwind CSS + shadcn-style UI components
- Server Actions for all DB ops (no API routes)

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

A `data.db` SQLite file is created automatically on first run.

### `better-sqlite3` native build

`better-sqlite3` is a native module. You need a working C/C++ toolchain:

- **Windows**: install Visual Studio Build Tools (C++ workload) and Python 3.
  Easiest path: `npm install --global windows-build-tools` (older) or install
  *Desktop development with C++* via the VS Installer.
- **macOS**: `xcode-select --install`
- **Linux**: `sudo apt-get install build-essential python3`

If `npm install` fails on the native build, run `npm rebuild better-sqlite3`
after toolchain is set up.

## Project structure

```
app/
  page.tsx           Calculator (home)
  history/page.tsx   Saved calculations
  actions.ts         Server actions: saveCalc, getCalcs, deleteCalc
  layout.tsx
  globals.css
lib/
  db.ts              SQLite connection + schema bootstrap
  utils.ts
components/
  CalculatorForm.tsx
  HistoryTable.tsx
  ui/                button, input, card, table
```

## Schema

```sql
CREATE TABLE calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  total_price REAL NOT NULL,
  qty_paid INTEGER NOT NULL,
  qty_free INTEGER NOT NULL,
  gst_percent REAL NOT NULL DEFAULT 0,
  per_unit_price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
