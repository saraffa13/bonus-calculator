"use server";

import { searchProducts as searchProductsStore, type Product } from "@/lib/store";

export async function searchProducts(query: string): Promise<Product[]> {
  return searchProductsStore(query);
}
