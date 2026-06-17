import { KeyRound, Plug, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";

export function SettingsPage() {
  const settingsCards: Array<{ title: string; description: string; icon: LucideIcon }> = [
    { title: "Blaze OAuth", description: "Connect creator identity and channel access.", icon: KeyRound },
    { title: "API services", description: "Swap mock services with Blaze-backed adapters.", icon: Plug },
    { title: "Access policy", description: "Prepare role and workspace controls.", icon: ShieldCheck }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Integration controls for the Blaze workspace"
        description="The foundation is ready for OAuth, API credentials, event subscriptions, and deployment configuration."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {settingsCards.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardContent className="p-5">
              <Icon className="mb-5 h-5 w-5 text-blaze" />
              <h2 className="text-sm font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
