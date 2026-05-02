import { getCalcs } from "@/app/actions";
import { HistoryTable } from "@/components/HistoryTable";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const rows = await getCalcs();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All your saved calculations.
        </p>
      </div>
      <HistoryTable rows={rows} />
    </div>
  );
}
