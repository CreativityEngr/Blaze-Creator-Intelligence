import type { AnalyticsRange } from "@blaze/shared";
import { Button } from "@/components/ui/button";

const options: Array<{ value: AnalyticsRange; label: string }> = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "all", label: "All time" }
];

export function RangeSelector({ value, onChange }: { value: AnalyticsRange; onChange: (range: AnalyticsRange) => void }) {
  return (
    <div className="inline-flex rounded-md border border-line bg-white/[0.025] p-1">
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={value === option.value ? "secondary" : "ghost"}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
