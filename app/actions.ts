"use server";

import db, { type Calculation, type Product } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type SaveCalcInput = {
  productName: string;
  totalPrice: number;
  qtyPaid: number;
  qtyFree: number;
  gstPercent: number;
  perUnitPrice: number;
};

export async function saveCalc(input: SaveCalcInput) {
  const stmt = db.prepare(`
    INSERT INTO calculations
      (product_name, total_price, qty_paid, qty_free, gst_percent, per_unit_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.productName,
    input.totalPrice,
    input.qtyPaid,
    input.qtyFree,
    input.gstPercent,
    input.perUnitPrice
  );
  revalidatePath("/history");
  return { id: Number(result.lastInsertRowid) };
}

export async function getCalcs(search?: string): Promise<Calculation[]> {
  if (search && search.trim()) {
    return db
      .prepare(
        `SELECT * FROM calculations WHERE product_name LIKE ? ORDER BY created_at DESC`
      )
      .all(`%${search.trim()}%`) as Calculation[];
  }
  return db
    .prepare(`SELECT * FROM calculations ORDER BY created_at DESC`)
    .all() as Calculation[];
}

export async function deleteCalc(id: number) {
  db.prepare(`DELETE FROM calculations WHERE id = ?`).run(id);
  revalidatePath("/history");
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = (query || "").trim();
  if (!q) {
    return db
      .prepare(`SELECT * FROM products ORDER BY name LIMIT 15`)
      .all() as Product[];
  }
  return db
    .prepare(
      `SELECT * FROM products WHERE name LIKE ? ORDER BY name LIMIT 25`
    )
    .all(`%${q}%`) as Product[];
}
