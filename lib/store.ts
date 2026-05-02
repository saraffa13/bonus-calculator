import fs from "fs";
import path from "path";
import productsData from "@/data/products.json";

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

export const products = productsData as Product[];

const CALC_FILE = path.join(process.cwd(), "data", "calculations.json");

function readCalcs(): Calculation[] {
  try {
    const raw = fs.readFileSync(CALC_FILE, "utf8");
    return JSON.parse(raw) as Calculation[];
  } catch {
    return [];
  }
}

function writeCalcs(rows: Calculation[]) {
  fs.mkdirSync(path.dirname(CALC_FILE), { recursive: true });
  fs.writeFileSync(CALC_FILE, JSON.stringify(rows, null, 2));
}

export function listCalcs(search?: string): Calculation[] {
  const rows = readCalcs().slice().sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
  if (!search?.trim()) return rows;
  const q = search.trim().toLowerCase();
  return rows.filter((r) => r.product_name.toLowerCase().includes(q));
}

export function addCalc(input: Omit<Calculation, "id" | "created_at">): Calculation {
  const rows = readCalcs();
  const id = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
  const row: Calculation = {
    id,
    created_at: new Date().toISOString(),
    ...input,
  };
  rows.push(row);
  writeCalcs(rows);
  return row;
}

export function removeCalc(id: number) {
  const rows = readCalcs().filter((r) => r.id !== id);
  writeCalcs(rows);
}

export function searchProducts(query: string, limit = 25): Product[] {
  const q = (query || "").trim().toLowerCase();
  if (!q) {
    return [...products]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 15);
  }
  return products
    .filter((p) => p.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}
