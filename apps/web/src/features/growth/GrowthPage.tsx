import type { GrowthSummary } from "@blaze/shared";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, QueryErrorState } from "@/components/QueryState";
import { GrowthSkeleton } from "@/components/PageSkeletons";
import { useGrowth } from "@/hooks/useCreatorInsights";
import { cn, getSignalClass } from "@/lib/utils";
import { RangeSelector } from "@/components/RangeSelector";
import type { AnalyticsRange } from "@blaze/shared";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1
});

export function GrowthPage() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const { data, error, isError, isPending, refetch } = useGrowth(range);

  return (
    <div>
      <PageHeader
        eyebrow="Growth"
        title="Momentum across audience, subscribers, and attention"
        description="Follower growth, subscriber movement, and viewer trends reveal where channel momentum is strengthening."
      />
      <div className="mb-4 flex justify-end">
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {isPending && <GrowthSkeleton />}
      {isError && <QueryErrorState error={error} onRetry={() => void refetch()} />}
      {data && <GrowthContent data={data} />}
    </div>
  );
}

function GrowthContent({ data }: { data: GrowthSummary }) {
  const { points } = data;

  if (points.length === 0) {
    return <EmptyState title="Your growth story is just beginning" description="Trends will appear as your channel history builds." />;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard title="Follower growth">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={points}>
            <defs>
              <linearGradient id="followers" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#d6dbe4" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#d6dbe4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
            <YAxis
              domain={[0, "auto"]}
              stroke="var(--chart-axis)"
              tickFormatter={(value) => compactNumber.format(value)}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: 8 }} />
            <Area dataKey="followers" stroke="var(--chart-neutral)" fill="url(#followers)" strokeWidth={2.5} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Subscriber growth">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={points}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
            <YAxis
              domain={[0, "auto"]}
              stroke="var(--chart-axis)"
              tickFormatter={(value) => compactNumber.format(value)}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: 8 }} />
            <Line dataKey="subscribers" stroke="var(--color-success)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Viewer trends">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={points}>
            <defs>
              <linearGradient id="viewers" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7aa7ff" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#7aa7ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
            <YAxis
              domain={[0, "auto"]}
              stroke="var(--chart-axis)"
              tickFormatter={(value) => compactNumber.format(value)}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: 8 }} />
            <Area dataKey="viewers" stroke="#7aa7ff" fill="url(#viewers)" strokeWidth={2.5} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Health Score history">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={points}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="var(--chart-axis)" tickLine={false} axisLine={false} width={42} />
            <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: 8 }} />
            <Line dataKey="healthScore" stroke="var(--color-blaze)" strokeWidth={2.5} dot={false} connectNulls isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Community activity">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={points}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
            <YAxis domain={[0, "auto"]} stroke="var(--chart-axis)" tickLine={false} axisLine={false} width={42} />
            <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: 8 }} />
            <Area dataKey="activities" stroke="#8ae6cf" fill="#8ae6cf" fillOpacity={0.12} strokeWidth={2.5} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="chart-surface">
        <CardHeader>
          <CardTitle>Growth readout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {data.readout.length === 0 && (
            <div className="sm:col-span-3 xl:col-span-1">
              <EmptyState title="No growth readout yet" description="Growth summaries will appear when they are available." />
            </div>
          )}
          {data.readout.map(({ label, value, detail }) => (
            <div key={label} className="rounded-md border border-line bg-white/[0.035] p-4">
              <p className="insight-label">{label}</p>
              <p className={cn("mt-2 text-3xl font-bold", getSignalClass(value))}>{value}</p>
              <p className="supporting-signal mt-1 text-xs font-medium">{detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="chart-surface overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 px-2 sm:px-5">{children}</CardContent>
    </Card>
  );
}
