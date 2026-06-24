import type { SettingsIntegration } from "@blaze/shared";
import { DatabaseZap, KeyRound, Plug, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, QueryErrorState } from "@/components/QueryState";
import { SettingsSkeleton } from "@/components/PageSkeletons";
import { useBenchmarkResearch, useSettings } from "@/hooks/useCreatorInsights";
import { cn } from "@/lib/utils";

const integrationIcons: Record<SettingsIntegration["id"], LucideIcon> = {
  oauth: KeyRound,
  api: Plug,
  access: ShieldCheck
};

const integrationStyles: Record<SettingsIntegration["id"], string> = {
  oauth: "settings-oauth",
  api: "settings-api",
  access: "settings-access"
};

export function SettingsPage() {
  const { data, error, isError, isPending, refetch } = useSettings();
  const research = useBenchmarkResearch();

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Connection and research status"
        description="Review your Blaze connection, protected access, and the benchmark research powering creator intelligence."
      />

      {isPending && <SettingsSkeleton />}
      {isError && <QueryErrorState error={error} onRetry={() => void refetch()} />}
      {data && <SettingsContent integrations={data.integrations} />}
      {research.data && (
        <Card className="settings-card mt-4">
          <CardContent className="grid gap-5 p-5 md:grid-cols-[1.2fr_repeat(4,0.7fr)] md:items-center">
            <div>
              <DatabaseZap className="information-icon mb-4 h-5 w-5" />
              <h2 className="information-title text-base">Benchmark research</h2>
              <p className="supporting-signal mt-2 text-sm font-medium">
                Creator benchmark research is {research.data.status === "collecting" ? "actively building" : "waiting for its first observations"}.
              </p>
            </div>
            <ResearchMetric label="Captures" value={String(research.data.runCount)} />
            <ResearchMetric label="Distinct creators" value={String(research.data.distinctCreatorCount)} />
            <ResearchMetric label="Confidence" value={`${Math.round(research.data.confidence * 100)}%`} />
            <ResearchMetric
              label="Research gate"
              value={research.data.researchReady ? "Ready" : "Collecting"}
              active={!research.data.researchReady}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResearchMetric({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div>
      <p className="information-title text-xs">{label}</p>
      <div className={cn("mt-2 flex min-h-7 items-center gap-2 text-lg font-semibold", active ? "text-ink" : "text-success")}>
        <span>{value}</span>
        {active && (
          <span className="research-activity-dots" aria-label="Benchmark collection is active">
            <span />
            <span />
            <span />
          </span>
        )}
      </div>
    </div>
  );
}

function SettingsContent({ integrations }: { integrations: SettingsIntegration[] }) {
  if (integrations.length === 0) {
    return <EmptyState title="No connection details yet" description="Connection details will appear once your Blaze account is linked." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {integrations.map(({ id, title, description }) => {
        const Icon = integrationIcons[id];

        return (
          <Card key={id} className={cn("settings-card", integrationStyles[id])}>
            <CardContent className="p-5">
              <Icon className="information-icon mb-5 h-5 w-5" />
              <h2 className="information-title text-base">{title}</h2>
              <p className="supporting-signal mt-2 text-sm font-medium leading-6">{description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
