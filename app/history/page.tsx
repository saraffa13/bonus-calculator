import { HistoryTable } from "@/components/HistoryTable";

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-stack_gap">
      <div className="mb-gutter">
        <h1 className="text-h1 text-on-background mb-1">History</h1>
        <p className="text-body-base text-on-surface-variant">
          Your last 5 saved calculations (stored locally in this browser).
        </p>
      </div>
      <HistoryTable />
    </div>
  );
}
