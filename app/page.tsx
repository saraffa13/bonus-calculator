import { CalculatorForm } from "@/components/CalculatorForm";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Buy X Get Y Free Calculator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find the real per-unit price when freebies are bundled in.
        </p>
      </div>
      <CalculatorForm />
    </div>
  );
}
