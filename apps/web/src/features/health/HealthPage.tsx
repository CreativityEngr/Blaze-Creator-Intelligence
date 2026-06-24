import type { HealthScore } from "@blaze/shared";
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Sparkles, TrendingUp, Waves } from "lucide-react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, QueryErrorState } from "@/components/QueryState";
import { HealthSkeleton } from "@/components/PageSkeletons";
import { useHealthScore } from "@/hooks/useCreatorInsights";
import { getHealthScorePresentation } from "@/lib/healthScore";
import { cn, getSignalClass } from "@/lib/utils";

const healthZones = [
  { label: "Critical", start: 0, end: 25, color: "#ef4657" },
  { label: "Weak", start: 25, end: 50, color: "#f18b3c" },
  { label: "Healthy", start: 50, end: 70, color: "#f2a23a" },
  { label: "Strong", start: 70, end: 85, color: "#f6d44a" },
  { label: "Elite", start: 85, end: 100, color: "#53d6a0" }
] as const;

export function HealthPage() {
  const { data, error, isError, isPending, refetch } = useHealthScore();

  return (
    <div>
      <PageHeader
        eyebrow="Health score"
        title="Creator Health"
        description="A single score that measures the strength of your channel."
      />

      {isPending && <HealthSkeleton />}
      {isError && <QueryErrorState error={error} onRetry={() => void refetch()} />}
      {data && <HealthContent data={data} />}
    </div>
  );
}

function HealthContent({ data }: { data: HealthScore }) {
  const gaugeProgress = Math.max(0, Math.min(100, data.score));
  const performance = getHealthScorePresentation(data.score);
  const markerAngle = Math.PI - (gaugeProgress / 100) * Math.PI;
  const markerRadius = 190;
  const markerX = 260 + markerRadius * Math.cos(markerAngle);
  const markerY = 244 - markerRadius * Math.sin(markerAngle);
  const markerStemInner = pointForScore(gaugeProgress, 172);
  const markerStemOuter = pointForScore(gaugeProgress, 208);
  const performanceStyle = {
    "--health-performance": performance.color,
    "--health-performance-glow": performance.glow
  } as CSSProperties;

  return (
    <section className="health-stage relative overflow-hidden rounded-lg border border-line" style={performanceStyle}>
      <div className="health-stage-grid grid items-center gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)] lg:px-10 lg:py-10">
        <div className="health-gauge-zone">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="information-title text-sm">Creator health score</p>
            <p className="text-xs font-medium text-muted">Updated today</p>
          </div>

          <div className="health-gauge mx-auto">
            <svg className="h-full w-full" viewBox="0 0 520 300" role="img" aria-label={`Creator health score ${data.score} out of 100, ${performance.status}`}>
              <defs>
                <filter id="healthGaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path className="health-gauge-track" d="M 70 244 A 190 190 0 0 1 450 244" pathLength="100" />
              {healthZones.map((zone, index) => (
                <path
                  key={zone.label}
                  className="health-zone-segment"
                  data-zone={zone.label}
                  data-score-start={zone.start}
                  data-score-end={zone.end}
                  d={describeScoreArc(zone.start, zone.end)}
                  pathLength="1"
                  style={{ "--zone-color": zone.color, "--zone-delay": `${index * 90}ms` } as CSSProperties}
                />
              ))}
              <line
                className="health-position-stem"
                x1={markerStemInner.x}
                y1={markerStemInner.y}
                x2={markerStemOuter.x}
                y2={markerStemOuter.y}
              />
              <circle className="health-position-halo" cx={markerX} cy={markerY} r="13" />
              <circle className="health-position-marker" cx={markerX} cy={markerY} r="7" />
            </svg>

            <div className="health-gauge-content">
              <div className="flex items-end justify-center gap-2">
                <span className="health-score-value">{data.score}</span>
                <span className="mb-3 text-lg font-semibold text-muted">/100</span>
              </div>
              <p className="health-status">{performance.status}</p>
            </div>
          </div>

          <div className="health-zone-legend mx-auto grid max-w-2xl grid-cols-5 gap-1">
            {healthZones.map((zone) => (
              <div key={zone.label} className="text-center">
                <span className="mx-auto block h-1 w-8 rounded-full" style={{ backgroundColor: zone.color }} />
                <span className="mt-2 block text-[10px] font-semibold text-muted">{zone.label}</span>
              </div>
            ))}
          </div>

          <div className="health-context mx-auto grid max-w-3xl grid-cols-2 md:grid-cols-4">
            <ScoreContext icon={Waves} label="Score model" value="Health v1" />
            <ScoreContext icon={Sparkles} label="Weekly change" value={formatPointChange(data.movement.weekly)} />
            <ScoreContext icon={CalendarDays} label="Monthly change" value={formatPointChange(data.movement.monthly)} />
            <ScoreContext icon={Activity} label="Health trend" value={data.healthTrend} performance />
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-sm font-medium leading-6 text-muted">{data.summary}</p>
        </div>

        <div className="health-explanation">
          <div className="priority-insight p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.045]">
                <TrendingUp className="information-icon h-4 w-4" />
              </div>
              <div>
                <p className="information-title text-sm">Priority insight</p>
                <p className="mt-2 text-base font-semibold leading-6 text-ink">{data.priorityInsight}</p>
                <p className="mt-2 text-xs leading-5 text-muted">Acting on this signal is the clearest path to improving the next score.</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="information-title text-sm">Score contributors</p>
              <p className="text-xs font-medium text-muted">What shapes your score</p>
            </div>

            {data.breakdown.length === 0 && (
              <EmptyState title="Your health story is still forming" description="Contributors will appear as channel activity builds." />
            )}
            {data.breakdown.map((item) => (
              <div key={item.label} className="contributor-row">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{item.explanation}</p>
                  </div>
                  <ContributorMovement change={item.change} direction={item.direction} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContributorMovement({
  change,
  direction
}: {
  change: number | null;
  direction: "up" | "down" | "flat";
}) {
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : ArrowRight;
  const value = change === null ? "Activity observed" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1 text-xs font-semibold",
        direction === "up" ? "text-success" : direction === "down" ? "text-danger" : "text-muted"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

function ScoreContext({
  icon: Icon,
  label,
  value,
  performance = false
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  performance?: boolean;
}) {
  return (
    <div className="health-context-item flex items-center justify-center gap-3 px-3 py-3">
      <Icon className="information-icon h-4 w-4 shrink-0" />
      <div>
        <p className="text-xs font-medium text-muted">{label}</p>
        <p
          className={cn(
            "mt-0.5 text-sm font-bold",
            performance ? "health-performance-text" : getSignalClass(value),
            label === "Score model" && "text-ink"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function formatPointChange(value: number) {
  return `${value > 0 ? "+" : ""}${value} ${Math.abs(value) === 1 ? "point" : "points"}`;
}

function pointForScore(score: number, radius: number) {
  const angle = (Math.PI - (score / 100) * Math.PI);
  return {
    x: 260 + radius * Math.cos(angle),
    y: 244 - radius * Math.sin(angle)
  };
}

function describeScoreArc(start: number, end: number) {
  const from = pointForScore(start, 190);
  const to = pointForScore(end, 190);
  return `M ${from.x} ${from.y} A 190 190 0 0 1 ${to.x} ${to.y}`;
}
