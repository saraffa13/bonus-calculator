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

export const products = productsData as Product[];

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
