import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getSignalClass } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "amber" | "gold" | "emerald" | "sapphire" | "violet";
};

export function MetricCard({ label, value, detail, icon: Icon, tone = "gold" }: MetricCardProps) {
  return (
    <Card className={cn("metric-card", `metric-${tone}`)}>
      <CardContent className="relative z-10 flex min-h-32 flex-col justify-between">
        <div className="flex items-center justify-between gap-4">
          <p className="metric-title">{label}</p>
          <div className="metric-icon flex h-9 w-9 items-center justify-center rounded-md border">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="metric-value tracking-normal">{value}</p>
          <p className={cn("metric-detail mt-2 text-xs", getSignalClass(detail))}>{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
