import type { CommunityMember, CommunitySummary } from "@blaze/shared";
import { MessageSquare, UserPlus, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, QueryErrorState } from "@/components/QueryState";
import { CommunitySkeleton } from "@/components/PageSkeletons";
import { useCommunity } from "@/hooks/useCreatorInsights";

export function CommunityPage() {
  const { data, error, isError, isPending, refetch } = useCommunity();

  return (
    <div>
      <PageHeader
        eyebrow="Community"
        title="Know who is moving closer to the core"
        description="Recent activity, followers, and subscribers are separated so community work stays precise."
      />

      {isPending && <CommunitySkeleton />}
      {isError && <QueryErrorState error={error} onRetry={() => void refetch()} />}
      {data && <CommunityContent data={data} />}
    </div>
  );
}

function CommunityContent({ data }: { data: CommunitySummary }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="community-surface">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent activity feed</CardTitle>
          <MessageSquare className="information-icon h-4 w-4" />
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentActivity.length === 0 && (
            <EmptyState title="No recent activity" description="New channel activity will appear here." />
          )}
          {data.recentActivity.map((activity) => (
            <div key={activity.id} className="activity-row flex min-w-0 flex-wrap gap-3 rounded-md border p-4 sm:flex-nowrap sm:gap-4">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white/35" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{activity.actorName}</p>
                <p className="supporting-signal mt-1 text-sm font-medium">{activity.label}</p>
              </div>
              <time className="ml-4 shrink-0 text-xs text-muted sm:ml-0">
                {new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(activity.createdAt))}
              </time>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <MemberList title="Followers" icon={UserPlus} members={data.followers} />
        <MemberList title="Subscribers" icon={WalletCards} members={data.subscribers} />
      </div>
    </div>
  );
}

type MemberListProps = {
  title: string;
  icon: typeof UserPlus;
  members: CommunityMember[];
};

function MemberList({ title, icon: Icon, members }: MemberListProps) {
  return (
    <Card className="community-surface">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Icon className="information-icon h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-3">
        {members.length === 0 && (
          <EmptyState title={`No ${title.toLowerCase()} yet`} description={`Recent ${title.toLowerCase()} will appear here.`} />
        )}
        {members.map((member) => (
          <div key={member.id} className="member-row flex min-w-0 items-center justify-between gap-3 rounded-md border px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{member.displayName}</p>
              <p className="supporting-signal mt-1 text-xs font-medium">{member.value}</p>
            </div>
            <time className="shrink-0 text-xs text-muted">{formatMemberDate(member.joinedAt)}</time>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatMemberDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}
