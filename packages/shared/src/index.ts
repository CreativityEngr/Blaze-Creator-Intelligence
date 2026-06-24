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

export type HealthScoreStatus = "Needs Attention" | "Healthy" | "Strong" | "Elite";

export function getHealthScoreStatus(score: number): HealthScoreStatus {
  if (score < 50) return "Needs Attention";
  if (score < 70) return "Healthy";
  if (score < 85) return "Strong";
  return "Elite";
}

export type HealthScore = {
  id: string;
  creatorId: string;
  score: number;
  status: HealthScoreStatus;
  grade: HealthScoreStatus;
  movement: {
    weekly: number;
    monthly: number;
  };
  healthTrend: "Declining" | "Stable" | "Improving";
  updatedAt: string;
  summary: string;
  priorityInsight: string;
  breakdown: HealthScoreBreakdown[];
};

export type HealthScoreBreakdown = {
  label: "Growth" | "Subscribers" | "Engagement" | "Community";
  change: number | null;
  direction: "up" | "down" | "flat";
  explanation: string;
};

export type StreamStatus = {
  isLive: boolean;
  title: string;
  category: string;
  currentViewers: number;
  followers: number;
  subscribers: number;
  durationSeconds: number;
  startedAt?: string;
};

export type GrowthPoint = {
  date: string;
  followers: number;
  subscribers: number;
  viewers: number;
  healthScore?: number;
  activities?: number;
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
  channelStatus: {
    summary: string;
    readiness: string;
    lastStreamTitle: string | null;
    lastCategory: string | null;
    lastViewerCount: number | null;
    lastStreamAt: string | null;
    lastActivity: string | null;
    lastActivityAt: string | null;
  };
  creatorBrief: DecisionInsight[];
  followerDelta: string;
  subscriberDelta: string;
};

export type GrowthSummary = {
  range: AnalyticsRange;
  points: GrowthPoint[];
  readout: GrowthReadoutItem[];
};

export type AnalyticsRange = "7d" | "30d" | "all";

export type DecisionInsight = {
  label: string;
  what: string;
  why: string;
  next: string;
  direction: "up" | "down" | "flat";
};

export type InsightItem = {
  label: string;
  value: string;
};

export type AudienceIntelligenceSummary = {
  range: AnalyticsRange;
  metrics: Array<{
    label: string;
    value: string;
    detail: string;
    direction: "up" | "down" | "flat";
    confidence: "Low confidence" | "Emerging signal" | "Moderate confidence" | "High confidence";
    sampleSize: number;
    observationPeriod: string;
  }>;
  activityByDay: Array<{ date: string; count: number }>;
};

export type GrowthReadoutItem = {
  label: string;
  value: string;
  detail: string;
};

export type SettingsSummary = {
  integrations: SettingsIntegration[];
};

export type NotificationSummary = {
  unreadCount: number;
  items: CreatorNotification[];
};

export type CreatorNotification = {
  id: string;
  kind: "EVENT" | "INSIGHT" | "TREND" | "SYSTEM";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type BenchmarkResearchSummary = {
  status: "collecting" | "awaiting-data";
  capturedAt?: string;
  creatorCount: number;
  distinctCreatorCount: number;
  volatility: number | null;
  confidence: number;
  runCount: number;
  researchReady: boolean;
  percentiles: Array<{
    metric: string;
    sampleSize: number;
    p25?: number | null;
    median?: number | null;
    p75?: number | null;
    p90?: number | null;
  }>;
};

export type SettingsIntegration = {
  id: "oauth" | "api" | "access";
  title: string;
  description: string;
};

export type ApiEnvelope<T> = {
  data: T;
};

export type ApiErrorEnvelope = {
  error: {
    message: string;
  };
};
