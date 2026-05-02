"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/app/actions";
import type { Product } from "@/lib/db";

export function ProductPicker({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (p: Product) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      const rows = await searchProducts(query);
      if (!cancelled) {
        setResults(rows);
        setLoading(false);
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (p: Product) => {
    setQuery(p.name);
    setOpen(false);
    onSelect(p);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        placeholder="Search product..."
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-md border bg-white shadow-lg">
          {loading && results.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              No products found.
            </div>
          ) : (
            <ul className="py-1">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => pick(p)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-3"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      ₹{p.ptr.toFixed(2)}
                      {p.scheme_raw ? ` • ${p.scheme_raw}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
