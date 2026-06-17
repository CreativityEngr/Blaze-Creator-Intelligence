import { MessageSquare, UserPlus, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { useCommunity } from "@/hooks/useCreatorInsights";

export function CommunityPage() {
  const { data } = useCommunity();

  return (
    <div>
      <PageHeader
        eyebrow="Community"
        title="Know who is moving closer to the core"
        description="Recent activity, followers, and subscribers are separated so community work stays precise."
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent activity feed</CardTitle>
            <MessageSquare className="h-4 w-4 text-blaze" />
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 rounded-md border border-line bg-white/[0.035] p-4">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blaze" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{activity.actorName}</p>
                  <p className="mt-1 text-sm text-muted">{activity.label}</p>
                </div>
                <time className="shrink-0 text-xs text-muted">
                  {new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(activity.createdAt))}
                </time>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <MemberList title="Followers" icon={UserPlus} members={data?.followers ?? []} />
          <MemberList title="Subscribers" icon={WalletCards} members={data?.subscribers ?? []} />
        </div>
      </div>
    </div>
  );
}

type MemberListProps = {
  title: string;
  icon: typeof UserPlus;
  members: Array<{ id: string; displayName: string; joinedAt: string; value: string }>;
};

function MemberList({ title, icon: Icon, members }: MemberListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Icon className="h-4 w-4 text-blaze" />
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-4 rounded-md bg-white/[0.035] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">{member.displayName}</p>
              <p className="mt-1 text-xs text-muted">{member.value}</p>
            </div>
            <p className="text-xs text-muted">{member.joinedAt}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
