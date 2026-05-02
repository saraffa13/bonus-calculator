export type HistoryEntry = {
  id: number;
  product_name: string;
  total_price: number;
  qty_paid: number;
  qty_free: number;
  gst_percent: number;
  per_unit_price: number;
  created_at: string;
};

const KEY = "scbc:history";
const MAX = 5;

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function write(rows: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(rows));
}

export function getHistory(): HistoryEntry[] {
  return read();
}

export function addHistory(input: Omit<HistoryEntry, "id" | "created_at">): HistoryEntry {
  const rows = read();
  const id = (rows[0]?.id ?? 0) + 1;
  const entry: HistoryEntry = {
    id,
    created_at: new Date().toISOString(),
    ...input,
  };
  const next = [entry, ...rows].slice(0, MAX);
  write(next);
  return entry;
}

export function deleteHistory(id: number) {
  const next = read().filter((r) => r.id !== id);
  write(next);
}

export function clearHistory() {
  write([]);
}
