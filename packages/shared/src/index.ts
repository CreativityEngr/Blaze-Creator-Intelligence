export type Creator = {
  id: string;
  blazeId: string;
  displayName: string;
  avatarUrl: string;
  createdAt: string;
};

export type Snapshot = {
  id: string;
  creatorId: string;
  followerCount: number;
  subscriberCount: number;
  viewerCount: number;
  createdAt: string;
};

export type ActivityType =
  | "follow"
  | "subscribe"
  | "renewal"
  | "community_post"
  | "stream_started";

export type Activity = {
  id: string;
  creatorId: string;
  type: ActivityType;
  actorId: string;
  actorName: string;
  label: string;
  createdAt: string;
};

export type HealthScore = {
  id: string;
  creatorId: string;
  score: number;
  updatedAt: string;
  breakdown: HealthScoreBreakdown[];
};

export type HealthScoreBreakdown = {
  label: "Growth" | "Subscribers" | "Engagement" | "Community";
  score: number;
  trend: number;
};

export type StreamStatus = {
  isLive: boolean;
  title: string;
  category: string;
  currentViewers: number;
  followers: number;
  subscribers: number;
  durationSeconds: number;
};

export type GrowthPoint = {
  date: string;
  followers: number;
  subscribers: number;
  viewers: number;
};

export type CommunitySummary = {
  recentActivity: Activity[];
  followers: CommunityMember[];
  subscribers: CommunityMember[];
};

export type CommunityMember = {
  id: string;
  displayName: string;
  joinedAt: string;
  value: string;
};

export type DashboardSummary = {
  creator: Creator;
  stream: StreamStatus;
};

export type GrowthSummary = {
  points: GrowthPoint[];
};

export type ApiEnvelope<T> = {
  data: T;
};
