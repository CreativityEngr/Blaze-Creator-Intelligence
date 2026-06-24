import { useState } from "react";
import type { AnalyticsRange } from "@blaze/shared";
import { Activity, Repeat2, TrendingUp, UserRoundCheck } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorState } from "@/components/QueryState";
import { AudienceSkeleton } from "@/components/PageSkeletons";
import { RangeSelector } from "@/components/RangeSelector";
import { useAudienceIntelligence } from "@/hooks/useCreatorInsights";
import { cn, getSignalClass } from "@/lib/utils";

const icons = [UserRoundCheck, Repeat2, Activity, TrendingUp];

export function AudiencePage() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const { data, error, isError, isPending, refetch } = useAudienceIntelligence(range);

  return (
    <div>
      <PageHeader
        eyebrow="Audience intelligence"
        title="Turn audience behavior into creator decisions"
        description="Efficiency, conversion, engagement, and momentum reveal how effectively the channel turns attention into community."
      />
      <div className="mb-4 flex justify-end">
        <RangeSelector value={range} onChange={setRange} />
      </div>
      {isPending && <AudienceSkeleton />}
      {isError && <QueryErrorState error={error} onRetry={() => void refetch()} />}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric, index) => {
              const Icon = icons[index] ?? Activity;
              return (
                <Card key={metric.label} className="community-surface">
                  <CardContent className="p-5">
                    <Icon className="information-icon mb-5 h-5 w-5" />
                    <p className="information-title text-sm">{metric.label}</p>
                    <p className={cn("mt-3 text-3xl font-bold text-ink", getSignalClass(metric.direction === "up" ? "+" : metric.direction === "down" ? "-" : ""))}>
                      {metric.value}
                    </p>
                    <p className="supporting-signal mt-2 text-xs font-medium">{metric.detail}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-muted">
                      <span className="signal-chip">{metric.confidence}</span>
                      <span className="signal-chip">
                        {metric.sampleSize} observed {metric.label === "Audience growth momentum" ? "days" : metric.sampleSize === 1 ? "stream" : "streams"}
                      </span>
                      <span className="signal-chip">{metric.observationPeriod}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-4">
            <Card className="chart-surface overflow-hidden">
              <CardHeader><CardTitle>Audience activity</CardTitle></CardHeader>
              <CardContent className="min-w-0 px-2 sm:px-5">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={data.activityByDay}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, "auto"]} stroke="var(--chart-axis)" tickLine={false} axisLine={false} width={42} />
                    <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: 8 }} />
                    <Area dataKey="count" stroke="#8ae6cf" fill="#8ae6cf" fillOpacity={0.14} strokeWidth={2.5} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
