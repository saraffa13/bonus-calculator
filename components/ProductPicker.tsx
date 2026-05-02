"use client";

import { useEffect, useRef, useState } from "react";
import { searchProducts } from "@/app/actions";
import type { Product } from "@/lib/store";

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
      <div className="relative">
        <input
          placeholder="Search product..."
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="w-full h-element_height pl-3 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
          expand_more
        </span>
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-card">
          {loading && results.length === 0 ? (
            <div className="p-3 text-body-sm text-on-surface-variant">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-body-sm text-on-surface-variant">
              No products found.
            </div>
          ) : (
            <ul className="py-1">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => pick(p)}
                    className="w-full text-left px-3 py-2 text-body-sm hover:bg-surface-container-low flex items-center justify-between gap-3"
                  >
                    <span className="truncate text-on-surface">{p.name}</span>
                    <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
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
