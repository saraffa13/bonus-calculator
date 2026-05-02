"use client";

import { useMemo, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR } from "@/lib/utils";
import type { Calculation } from "@/lib/store";
import { deleteCalc } from "@/app/actions";

export function HistoryTable({ rows }: { rows: Calculation[] }) {
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.product_name.toLowerCase().includes(q));
  }, [rows, search]);

  const handleDelete = (id: number) => {
    setPendingId(id);
    startTransition(async () => {
      await deleteCalc(id);
      setPendingId(null);
    });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by product name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Deal</TableHead>
              <TableHead className="text-right">Total Paid</TableHead>
              <TableHead className="text-right">Per-Unit</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  No calculations yet.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {new Date(r.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="font-medium">{r.product_name}</TableCell>
                <TableCell>
                  {r.qty_paid}+{r.qty_free}
                </TableCell>
                <TableCell className="text-right">
                  {formatINR(r.total_price)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatINR(r.per_unit_price)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(r.id)}
                    disabled={pendingId === r.id}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
