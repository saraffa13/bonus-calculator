# Silver Cross Bonus Calculator

A Next.js 14 (App Router) app that computes the effective per-unit price under
"Buy X Get Y Free" deals for the Silver Cross product catalogue.

> Buy 3 Get 3 Free at ₹100/item → ₹300 / 6 = **₹50 per unit**

## Stack

- Next.js 14 (App Router) + TypeScript
- JSON-file storage (no database — `data/products.json`, `data/calculations.json`)
- Tailwind CSS + shadcn-style UI components
- Server Actions for all reads/writes

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Data

- `data/products.json` — 219 seeded products (name, PTR, scheme, MRP, composition, etc.). Edit by hand or replace the file.
- `data/calculations.json` — saved calculations, written via server actions.

## Project structure

```
app/
  page.tsx           Calculator (home)
  history/page.tsx   Saved calculations
  actions.ts         Server actions
  layout.tsx
  globals.css
lib/
  store.ts           JSON-backed store (products + calculations)
  utils.ts
components/
  CalculatorForm.tsx
  ProductPicker.tsx
  HistoryTable.tsx
  ui/                button, input, card, table
data/
  products.json
  calculations.json
```
