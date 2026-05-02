import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data.db");

declare global {
  // eslint-disable-next-line no-var
  var __sqliteDb: Database.Database | undefined;
}

const db = global.__sqliteDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") global.__sqliteDb = db;

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS calculations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    total_price REAL NOT NULL,
    qty_paid INTEGER NOT NULL,
    qty_free INTEGER NOT NULL,
    gst_percent REAL NOT NULL DEFAULT 0,
    per_unit_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    ptr REAL NOT NULL,
    scheme_raw TEXT,
    scheme_paid INTEGER,
    scheme_free INTEGER,
    sc_code TEXT,
    composition TEXT,
    form TEXT,
    packing TEXT,
    mrp REAL,
    pts REAL,
    gift TEXT,
    division TEXT
  );
`);

// Add columns if upgrading from older schema
for (const col of [
  "sc_code TEXT",
  "composition TEXT",
  "form TEXT",
  "packing TEXT",
  "mrp REAL",
  "pts REAL",
  "gift TEXT",
  "division TEXT",
]) {
  try {
    db.exec(`ALTER TABLE products ADD COLUMN ${col}`);
  } catch {
    /* column exists */
  }
}

export default db;

export type Calculation = {
  id: number;
  product_name: string;
  total_price: number;
  qty_paid: number;
  qty_free: number;
  gst_percent: number;
  per_unit_price: number;
  created_at: string;
};

export type Product = {
  id: number;
  name: string;
  ptr: number;
  scheme_raw: string | null;
  scheme_paid: number | null;
  scheme_free: number | null;
  sc_code: string | null;
  composition: string | null;
  form: string | null;
  packing: string | null;
  mrp: number | null;
  pts: number | null;
  gift: string | null;
  division: string | null;
};
