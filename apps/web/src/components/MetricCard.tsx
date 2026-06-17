import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex min-h-32 flex-col justify-between">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">{label}</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white/[0.04]">
            <Icon className="h-4 w-4 text-blaze" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-normal text-ink">{value}</p>
          <p className="mt-1 text-xs text-muted">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
