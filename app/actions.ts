"use server";

import {
  addCalc,
  listCalcs,
  removeCalc,
  searchProducts as searchProductsStore,
  type Calculation,
  type Product,
} from "@/lib/store";
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
  const row = addCalc({
    product_name: input.productName,
    total_price: input.totalPrice,
    qty_paid: input.qtyPaid,
    qty_free: input.qtyFree,
    gst_percent: input.gstPercent,
    per_unit_price: input.perUnitPrice,
  });
  revalidatePath("/history");
  return { id: row.id };
}

export async function getCalcs(search?: string): Promise<Calculation[]> {
  return listCalcs(search);
}

export async function deleteCalc(id: number) {
  removeCalc(id);
  revalidatePath("/history");
}

export async function searchProducts(query: string): Promise<Product[]> {
  return searchProductsStore(query);
}
