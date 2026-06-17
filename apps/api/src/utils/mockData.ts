import type {
  Activity,
  CommunityMember,
  Creator,
  GrowthPoint,
  HealthScore,
  StreamStatus
} from "@blaze/shared";

export const mockCreator: Creator = {
  id: "creator_01",
  blazeId: "blaze_aria_lane",
  displayName: "Aria Lane",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  createdAt: "2026-01-12T09:00:00.000Z"
};

export const mockStream: StreamStatus = {
  isLive: true,
  title: "Building a creator business without burning out",
  category: "Creator Strategy",
  currentViewers: 2847,
  followers: 128420,
  subscribers: 18420,
  durationSeconds: 7420
};

export const mockActivities: Activity[] = [
  {
    id: "activity_01",
    creatorId: mockCreator.id,
    type: "subscribe",
    actorId: "fan_ela",
    actorName: "Ela Morgan",
    label: "joined the inner circle",
    createdAt: "2026-06-17T08:42:00.000Z"
  },
  {
    id: "activity_02",
    creatorId: mockCreator.id,
    type: "follow",
    actorId: "fan_kai",
    actorName: "Kai Bennett",
    label: "followed from a clip",
    createdAt: "2026-06-17T08:31:00.000Z"
  },
  {
    id: "activity_03",
    creatorId: mockCreator.id,
    type: "community_post",
    actorId: "fan_mina",
    actorName: "Mina Sol",
    label: "started a high-signal discussion",
    createdAt: "2026-06-17T08:09:00.000Z"
  },
  {
    id: "activity_04",
    creatorId: mockCreator.id,
    type: "renewal",
    actorId: "fan_noah",
    actorName: "Noah Cross",
    label: "renewed a 6 month subscription",
    createdAt: "2026-06-17T07:55:00.000Z"
  }
];

export const mockFollowers: CommunityMember[] = [
  { id: "f_01", displayName: "Kai Bennett", joinedAt: "2026-06-17", value: "Clip referral" },
  { id: "f_02", displayName: "Rin Carter", joinedAt: "2026-06-16", value: "Live discovery" },
  { id: "f_03", displayName: "Samira Cole", joinedAt: "2026-06-16", value: "Community share" }
];

export const mockSubscribers: CommunityMember[] = [
  { id: "s_01", displayName: "Ela Morgan", joinedAt: "2026-06-17", value: "Founding tier" },
  { id: "s_02", displayName: "Noah Cross", joinedAt: "2026-06-11", value: "6 month streak" },
  { id: "s_03", displayName: "Jules Rivera", joinedAt: "2026-06-10", value: "Premium tier" }
];

export const mockGrowthPoints: GrowthPoint[] = [
  { date: "Jun 10", followers: 121200, subscribers: 17120, viewers: 2140 },
  { date: "Jun 11", followers: 122050, subscribers: 17310, viewers: 2210 },
  { date: "Jun 12", followers: 123280, subscribers: 17580, viewers: 2380 },
  { date: "Jun 13", followers: 124100, subscribers: 17720, viewers: 2300 },
  { date: "Jun 14", followers: 125900, subscribers: 17980, viewers: 2520 },
  { date: "Jun 15", followers: 126700, subscribers: 18130, viewers: 2680 },
  { date: "Jun 16", followers: 127680, subscribers: 18290, viewers: 2790 },
  { date: "Jun 17", followers: 128420, subscribers: 18420, viewers: 2847 }
];

export const mockHealthScore: HealthScore = {
  id: "health_01",
  creatorId: mockCreator.id,
  score: 87,
  updatedAt: "2026-06-17T08:45:00.000Z",
  breakdown: [
    { label: "Growth", score: 91, trend: 8 },
    { label: "Subscribers", score: 84, trend: 5 },
    { label: "Engagement", score: 88, trend: 11 },
    { label: "Community", score: 85, trend: 6 }
  ]
};
