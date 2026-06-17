import { Gauge, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { useHealthScore } from "@/hooks/useCreatorInsights";

export function HealthPage() {
  const { data } = useHealthScore();
  const score = data?.score ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="Health score"
        title="A flagship signal for creator momentum"
        description="One memorable score that blends growth, subscriber strength, engagement, and community depth."
      />

      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blaze via-[#8ae6cf] to-[#7aa7ff]" />
        <CardContent className="grid gap-8 p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div className="flex flex-col justify-between rounded-lg border border-line bg-[#101114] p-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-blaze/25 bg-blaze/10 px-3 py-1 text-xs font-medium text-blaze">
                <Sparkles className="h-3.5 w-3.5" />
                Creator health
              </div>
              <Gauge className="h-5 w-5 text-blaze" />
            </div>

            <div className="my-10 flex items-end gap-3">
              <span className="text-7xl font-semibold tracking-normal text-ink md:text-8xl">{score}</span>
              <span className="mb-3 text-2xl font-medium text-muted">/100</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blaze via-[#8ae6cf] to-[#7aa7ff]"
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="mt-5 text-sm leading-6 text-muted">
              Strong channel health with subscriber quality and live engagement reinforcing each other.
            </p>
          </div>

          <div className="grid content-start gap-4">
            <div className="rounded-lg border border-line bg-white/[0.035] p-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blaze" />
                <div>
                  <p className="text-sm font-medium text-ink">Priority insight</p>
                  <p className="mt-1 text-sm text-muted">
                    Convert the spike in strategy-segment viewers into subscriber prompts before stream end.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {data?.breakdown.map((item) => (
                <Card key={item.label} className="bg-white/[0.03] shadow-none">
                  <CardHeader>
                    <CardTitle>{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-end justify-between">
                      <p className="text-3xl font-semibold">{item.score}</p>
                      <p className="text-sm text-[#8ae6cf]">+{item.trend}%</p>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.07]">
                      <div className="h-full rounded-full bg-blaze" style={{ width: `${item.score}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
