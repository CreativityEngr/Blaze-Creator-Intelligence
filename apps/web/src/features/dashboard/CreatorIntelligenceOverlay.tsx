import { useEffect } from "react";
import type { DecisionInsight } from "@blaze/shared";
import { ArrowUpRight, BarChart3, BookOpenText, Lightbulb, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreatorIntelligenceOverlay({
  open,
  onClose,
  insights
}: {
  open: boolean;
  onClose: () => void;
  insights: DecisionInsight[];
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const audience = insights[0];
  const content = insights[2];
  const opportunity = insights[1];

  return (
    <div className="intelligence-overlay fixed inset-0 z-[80] overflow-y-auto p-3 sm:p-6 lg:p-10" role="dialog" aria-modal="true" aria-labelledby="intelligence-title">
      <button className="absolute inset-0 cursor-default" aria-label="Close creator intelligence" onClick={onClose} />
      <section className="intelligence-report relative mx-auto min-h-full max-w-6xl overflow-hidden rounded-lg border">
        <div className="intelligence-report-glow" />
        <header className="relative flex items-start justify-between gap-4 border-b border-line p-5 sm:p-7">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-blaze">
              <Sparkles className="h-4 w-4" />
              Channel decision brief
            </div>
            <h2 id="intelligence-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Creator Intelligence</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              A decision-focused reading of your audience, content rhythm, and strongest next moves.
            </p>
          </div>
          <Button size="icon" variant="ghost" aria-label="Close creator intelligence" title="Close" onClick={onClose}>
            <X className="h-5 w-5 text-blaze" />
          </Button>
        </header>

        <div className="relative space-y-5 p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-2">
            <ReportSection icon={BarChart3} title="Audience" insight={audience} />
            <ReportSection icon={BookOpenText} title="Content" insight={content} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ReportList
              icon={Target}
              title="Recommendations"
              items={insights.map((insight) => insight.next)}
            />
            <ReportList
              icon={Lightbulb}
              title="Opportunities"
              items={[
                opportunity?.what,
                opportunity?.why,
                audience?.direction === "flat"
                  ? "Build a larger observation window before making a major format change."
                  : "Protect the channel behavior behind the strongest current signal."
              ].filter((item): item is string => Boolean(item))}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ReportSection({
  icon: Icon,
  title,
  insight
}: {
  icon: typeof BarChart3;
  title: string;
  insight?: DecisionInsight;
}) {
  return (
    <section className="intelligence-section rounded-lg border border-line p-5">
      <div className="flex items-center gap-2">
        <Icon className="information-icon h-4 w-4" />
        <h3 className="information-title text-sm">{title}</h3>
      </div>
      {insight ? (
        <>
          <p className="mt-4 text-lg font-semibold text-ink">{insight.label}</p>
          <p className="mt-2 text-sm leading-6 text-ink">{insight.what}</p>
          <p className="mt-3 text-sm leading-6 text-muted">{insight.why}</p>
          <div className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-sm font-semibold text-ink">
            <ArrowUpRight className="information-icon mt-0.5 h-4 w-4 shrink-0" />
            {insight.next}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">Additional observations are required before this section can form a reliable view.</p>
      )}
    </section>
  );
}

function ReportList({ icon: Icon, title, items }: { icon: typeof Target; title: string; items: string[] }) {
  return (
    <section className="intelligence-section rounded-lg border border-line p-5">
      <div className="flex items-center gap-2">
        <Icon className="information-icon h-4 w-4" />
        <h3 className="information-title text-sm">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-3 text-sm leading-6 text-ink">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blaze" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
