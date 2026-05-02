"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteHistory, getHistory, type HistoryEntry } from "@/lib/history";
import { formatINR } from "@/lib/utils";

export function HistoryTable() {
  const [rows, setRows] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRows(getHistory());
    setHydrated(true);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.product_name.toLowerCase().includes(q));
  }, [rows, search]);

  const handleDelete = (id: number) => {
    deleteHistory(id);
    setRows(getHistory());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-element_height pl-10 pr-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <Th>Date</Th>
                <Th>Product</Th>
                <Th>Deal</Th>
                <Th align="right">Total Paid</Th>
                <Th align="right">Per-Unit</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {!hydrated ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-on-surface-variant py-10"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-on-surface-variant py-10"
                  >
                    {rows.length === 0
                      ? "No calculations yet."
                      : "No matches."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-outline-variant border-opacity-40"
                  >
                    <Td className="whitespace-nowrap text-on-surface-variant">
                      {new Date(r.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </Td>
                    <Td className="text-on-surface font-semibold">
                      {r.product_name}
                    </Td>
                    <Td>
                      <span className="inline-flex items-center h-6 px-2 rounded-full bg-primary-fixed text-on-primary-fixed text-[12px] font-semibold">
                        {r.qty_paid}+{r.qty_free}
                      </span>
                    </Td>
                    <Td align="right">{formatINR(r.total_price)}</Td>
                    <Td
                      align="right"
                      className="text-on-surface font-semibold"
                    >
                      {formatINR(r.per_unit_price)}
                    </Td>
                    <Td align="right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        aria-label="Delete"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-error-container text-error transition-colors"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({
  children,
  align,
}: {
  children?: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      className={
        "h-10 px-3 align-middle text-label-caps uppercase whitespace-nowrap " +
        (align === "right" ? "text-right" : "text-left")
      }
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
  align,
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "right";
}) {
  return (
    <td
      className={
        "p-3 align-middle " +
        (align === "right" ? "text-right " : "") +
        className
      }
    >
      {children}
    </td>
  );
}
