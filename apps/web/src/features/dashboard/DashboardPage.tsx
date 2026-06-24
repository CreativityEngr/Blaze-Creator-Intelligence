import { useEffect, useState } from "react";
import type { DashboardSummary } from "@blaze/shared";
import { Activity, AlertCircle, ArrowRight, Clock3, HeartPulse, History, Radio, Sparkles, Tags, TrendingUp, UserPlus, Users, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorState } from "@/components/QueryState";
import { DashboardSkeleton } from "@/components/PageSkeletons";
import { useDashboard } from "@/hooks/useCreatorInsights";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { CreatorIntelligenceOverlay } from "@/features/dashboard/CreatorIntelligenceOverlay";

export function DashboardPage() {
  const { data, error, isError, isPending, refetch } = useDashboard();

  return (
    <div>
      <PageHeader
        eyebrow="Creator intelligence"
        title="Your channel, interpreted"
        description="Live performance, audience movement, and the decisions that matter before, during, and after every stream."
      />

      {isPending && <DashboardSkeleton />}
      {isError && <QueryErrorState error={error} onRetry={() => void refetch()} />}
      {data && <DashboardContent data={data} />}
    </div>
  );
}

function DashboardContent({ data }: { data: DashboardSummary }) {
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
  const { stream } = data;

  return (
    <>
      <div className="grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
        {stream.isLive ? <LiveStreamModule data={data} /> : <OfflineCreatorSummary data={data} />}

        <CreatorIntelligenceCard
          count={data.creatorBrief.length}
          onOpen={() => setIntelligenceOpen(true)}
        />
      </div>

      {stream.isLive && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MetricCard label="Followers" value={formatNumber(stream.followers)} detail={data.followerDelta} icon={UserPlus} tone="gold" />
          <MetricCard label="Subscribers" value={formatNumber(stream.subscribers)} detail={data.subscriberDelta} icon={WalletCards} tone="emerald" />
        </div>
      )}

      <CreatorIntelligenceOverlay
        open={intelligenceOpen}
        onClose={() => setIntelligenceOpen(false)}
        insights={data.creatorBrief}
      />
    </>
  );
}

function CreatorIntelligenceCard({
  count,
  onOpen
}: {
  count: number;
  onOpen: () => void;
}) {
  const insightLabel = count === 0
    ? "Insights are still forming"
    : `${count} actionable insight${count === 1 ? "" : "s"} ready`;

  return (
    <Card className="creator-intelligence-card lg:h-full">
      <CardContent className="flex min-h-64 flex-col justify-between p-5 md:p-6 lg:h-full">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-blaze/20 bg-blaze/[0.07]">
            <Sparkles className="information-icon h-5 w-5" />
          </div>
          <h2 className="information-title mt-6 text-lg">Creator Intelligence</h2>
          <p className={cn("mt-3 text-2xl font-semibold text-ink", count > 0 && "intelligence-ready-signal")}>
            {insightLabel}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            Audience, content, and next-step guidance from your latest channel activity.
          </p>
        </div>
        <Button className="mt-6 w-full justify-between" onClick={onOpen} disabled={count === 0}>
          View Brief
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function LiveStreamModule({ data }: { data: DashboardSummary }) {
  const { stream, channelStatus } = data;
  const liveDurationSeconds = useLiveDuration(stream.isLive, stream.durationSeconds, stream.startedAt);

  return (
    <Card className="command-hero live-command-card status-module relative h-full overflow-hidden">
      <div className="live-border-signal" aria-hidden="true" />
      <CardContent className="relative z-10 flex h-full flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="live-state inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-danger shadow-[0_0_14px_var(--color-danger)]" />
              Live now
            </div>
            <h2 className="mt-4 line-clamp-2 text-xl font-semibold text-ink md:text-2xl">
              {stream.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{channelStatus.summary}</p>
          </div>
          <div className="status-orbit flex h-11 w-11 shrink-0 items-center justify-center rounded-md border">
            <Radio className="information-icon h-5 w-5" />
          </div>
        </div>

        <div className="status-grid mt-auto grid grid-cols-3 gap-2 pt-6">
          <StatusSignal icon={Users} label="Viewers" value={formatNumber(stream.currentViewers)} emphasis />
          <StatusSignal icon={Clock3} label="Duration" value={formatDuration(liveDurationSeconds)} />
          <StatusSignal icon={Tags} label="Category" value={stream.category} />
        </div>
      </CardContent>
    </Card>
  );
}

function useLiveDuration(isLive: boolean, reportedSeconds: number, startedAt?: string) {
  const calculateDuration = () => {
    const safeReportedSeconds = Math.max(0, Math.floor(reportedSeconds));
    if (!isLive || !startedAt) return safeReportedSeconds;

    const startedAtMs = Date.parse(startedAt);
    if (!Number.isFinite(startedAtMs)) return safeReportedSeconds;
    return Math.max(safeReportedSeconds, Math.floor((Date.now() - startedAtMs) / 1000));
  };
  const [durationSeconds, setDurationSeconds] = useState(calculateDuration);

  useEffect(() => {
    setDurationSeconds(calculateDuration());
    if (!isLive) return;

    const interval = window.setInterval(() => {
      setDurationSeconds((current) => startedAt ? calculateDuration() : current + 1);
    }, 1_000);
    return () => window.clearInterval(interval);
  }, [isLive, reportedSeconds, startedAt]);

  return durationSeconds;
}

function OfflineCreatorSummary({ data }: { data: DashboardSummary }) {
  const { channelStatus, followerDelta, subscriberDelta } = data;
  const latestInsight = data.creatorBrief[0];

  return (
    <Card className="offline-summary lg:h-full">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
              <span className="h-2 w-2 rounded-full bg-muted" />
              Channel offline
            </div>
            <h2 className="mt-3 text-xl font-semibold text-blaze">Ready for your next stream</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{channelStatus.summary}</p>
          </div>
          <div className="offline-readiness rounded-md border px-4 py-3">
            <p className="text-xs font-semibold text-muted">Last active</p>
            <p className="mt-1 text-sm font-bold text-ink">{formatRelativeMoment(channelStatus.lastStreamAt)}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <StatusSignal
            icon={History}
            label="Last stream"
            value={channelStatus.lastStreamTitle ?? "No stream observed yet"}
            detail={channelStatus.lastCategory ?? undefined}
            valueTone="accent"
          />
          <StatusSignal
            icon={Users}
            label="Last audience"
            value={channelStatus.lastViewerCount === null ? "Building history" : `${formatNumber(channelStatus.lastViewerCount)} viewers`}
            valueTone="accent"
          />
          <StatusSignal
            icon={Activity}
            label="Last activity"
            value={channelStatus.lastActivity ?? "No recent activity"}
            detail={formatMoment(channelStatus.lastActivityAt)}
            valueTone="accent"
          />
        </div>

        <div className="offline-readout mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
          <ExecutiveSignal icon={TrendingUp} label="Follower movement" value={followerDelta} />
          <ExecutiveSignal icon={HeartPulse} label="Channel direction" value={latestInsight?.label ?? "Signals are still forming"} />
          <ExecutiveSignal icon={subscriberDelta.startsWith("-") ? AlertCircle : WalletCards} label="Subscriber movement" value={subscriberDelta} />
        </div>
      </CardContent>
    </Card>
  );
}

function ExecutiveSignal({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  const valueTone = value.trim().startsWith("+")
    ? "text-success"
    : value.trim().startsWith("-")
      ? "text-danger"
      : "text-blaze";

  return (
    <div className="flex min-w-0 items-start gap-3">
      <Icon className="information-icon mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-muted">{label}</p>
        <p className={cn("mt-1 text-sm font-semibold leading-5", valueTone)}>{value}</p>
      </div>
    </div>
  );
}

function StatusSignal({
  icon: Icon,
  label,
  value,
  emphasis = false,
  detail,
  valueTone = "default"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  emphasis?: boolean;
  detail?: string;
  valueTone?: "default" | "accent";
}) {
  const valueColor = valueTone === "accent" ? "text-blaze" : "text-ink";

  return (
    <div className="status-signal min-w-0 rounded-md border px-3 py-3">
      <div className="flex items-center gap-2">
        <Icon className="information-icon h-3.5 w-3.5 shrink-0" />
        <p className="text-[11px] font-semibold text-muted">{label}</p>
      </div>
      <p
        className={cn(
          emphasis ? "mt-2 truncate text-xl font-bold" : "mt-2 truncate text-sm font-semibold",
          valueColor
        )}
        title={value}
      >
        {value}
      </p>
      {detail && <p className="mt-1 text-[10px] font-medium text-muted">{detail}</p>}
    </div>
  );
}

function formatMoment(value: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatRelativeMoment(value: string | null) {
  if (!value) return "No stream recorded";
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 0) return formatMoment(value) ?? "Recently";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
