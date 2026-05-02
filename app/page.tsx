import { CalculatorForm } from "@/components/CalculatorForm";

export default function Home() {
  return (
    <div className="flex flex-col gap-stack_gap">
      <div className="mb-gutter">
        <h1 className="text-h1 text-on-background mb-1">
          Buy X Get Y Free Calculator
        </h1>
        <p className="text-body-base text-on-surface-variant">
          Find the real per-unit price when freebies are bundled in.
        </p>
      </div>
      <CalculatorForm />
    </div>
  );
}
