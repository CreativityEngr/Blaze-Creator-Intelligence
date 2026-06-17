import { Clock, Radio, Sparkles, Tags, Users, UserPlus, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { useDashboard } from "@/hooks/useCreatorInsights";
import { formatDuration, formatNumber } from "@/lib/utils";

export function DashboardPage() {
  const { data } = useDashboard();
  const stream = data?.stream;

  return (
    <div>
      <PageHeader
        eyebrow="Command center"
        title="Live audience pulse for your Blaze channel"
        description="A focused operating view for the signals that matter while a stream is moving."
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardContent className="relative min-h-72 p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blaze via-[#8ae6cf] to-[#7aa7ff]" />
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blaze/25 bg-blaze/10 px-3 py-1 text-xs font-medium text-blaze">
                <span className="h-2 w-2 rounded-full bg-blaze shadow-[0_0_18px_rgba(245,197,66,0.85)]" />
                {stream?.isLive ? "Live now" : "Offline"}
              </div>
              <Radio className="h-5 w-5 text-blaze" />
            </div>

            <p className="text-sm text-muted">Stream title</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-normal text-ink md:text-5xl">
              {stream?.title}
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-md border border-line bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-muted">Category</p>
                <p className="mt-1 text-sm font-medium">{stream?.category}</p>
              </div>
              <div className="rounded-md border border-line bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-muted">Duration</p>
                <p className="mt-1 text-sm font-medium">{formatDuration(stream?.durationSeconds ?? 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today’s creator brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Viewer momentum", "+14% in the first two hours"],
              ["Subscriber quality", "Premium tier conversions are outpacing follows"],
              ["Community signal", "Discussion volume is highest after strategy segments"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-line bg-white/[0.035] p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 text-sm font-medium text-ink">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current viewers" value={formatNumber(stream?.currentViewers ?? 0)} detail="Live audience" icon={Users} />
        <MetricCard label="Followers" value={formatNumber(stream?.followers ?? 0)} detail="+740 today" icon={UserPlus} />
        <MetricCard label="Subscribers" value={formatNumber(stream?.subscribers ?? 0)} detail="+130 today" icon={WalletCards} />
        <MetricCard label="Stream category" value={stream?.category ?? "Loading"} detail="Blaze taxonomy" icon={Tags} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <MetricCard label="Stream duration" value={formatDuration(stream?.durationSeconds ?? 0)} detail="Since going live" icon={Clock} />
        <MetricCard label="Signal quality" value="High" detail="Audience retention and chat velocity are aligned" icon={Sparkles} />
      </div>
    </div>
  );
}
