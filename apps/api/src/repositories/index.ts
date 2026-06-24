import { prisma } from "../prisma/client.js";

export const authRepository = {
  createState: (stateHash: string, codeVerifier: string, returnTo?: string) =>
    prisma.oAuthState.create({ data: { stateHash, codeVerifier, returnTo, expiresAt: new Date(Date.now() + 10 * 60_000) } }),
  consumeState: async (stateHash: string) => {
    const state = await prisma.oAuthState.findUnique({ where: { stateHash } });
    if (!state || state.expiresAt <= new Date()) return null;
    await prisma.oAuthState.delete({ where: { id: state.id } });
    return state;
  },
  upsertIdentity: async (profile: { userId: string; channelId: string; displayName: string; avatarUrl?: string }) => {
    const user = await prisma.user.upsert({
      where: { blazeUserId: profile.userId },
      update: { displayName: profile.displayName, avatarUrl: profile.avatarUrl },
      create: { blazeUserId: profile.userId, displayName: profile.displayName, avatarUrl: profile.avatarUrl }
    });
    const channel = await prisma.channel.upsert({
      where: { blazeChannelId: profile.channelId },
      update: { userId: user.id, displayName: profile.displayName, avatarUrl: profile.avatarUrl },
      create: { userId: user.id, blazeChannelId: profile.channelId, displayName: profile.displayName, avatarUrl: profile.avatarUrl }
    });
    return { user, channel };
  },
  saveCredential: (channelId: string, data: { accessToken: string; refreshToken?: string; expiresAt?: Date; scopes: string[] }) =>
    prisma.channelCredential.upsert({
      where: { channelId },
      update: { encryptedAccessToken: data.accessToken, encryptedRefreshToken: data.refreshToken, tokenExpiresAt: data.expiresAt, scopes: data.scopes },
      create: { channelId, encryptedAccessToken: data.accessToken, encryptedRefreshToken: data.refreshToken, tokenExpiresAt: data.expiresAt, scopes: data.scopes }
    }),
  createSession: (userId: string, tokenHash: string, expiresAt: Date) => prisma.session.create({ data: { userId, tokenHash, expiresAt } }),
  findSession: (tokenHash: string) => prisma.session.findUnique({ where: { tokenHash }, include: { user: { include: { channels: true } } } }),
  deleteSession: (tokenHash: string) => prisma.session.deleteMany({ where: { tokenHash } }),
  getCredential: (channelId: string) => prisma.channelCredential.findFirst({
    where: {
      OR: [
        { channelId },
        { channel: { blazeChannelId: channelId } }
      ]
    }
  })
};

export const channelRepository = {
  listAll: () => prisma.channel.findMany({ include: { credential: true } }),
  getById: (id: string) => prisma.channel.findUnique({ where: { id }, include: { credential: true, user: true } }),
  getByBlazeId: (blazeChannelId: string) => prisma.channel.findUnique({ where: { blazeChannelId } }),
  addSnapshot: (channelId: string, data: { viewers: number; followers: number; subscribers: number; isLive: boolean; title?: string; category?: string; startedAt?: Date }) =>
    prisma.$transaction([
      prisma.channelStatsSnapshot.create({ data: { channelId, viewerCount: data.viewers, isLive: data.isLive, streamTitle: data.title, streamCategory: data.category, streamStartedAt: data.startedAt } }),
      prisma.followerSnapshot.create({ data: { channelId, count: data.followers } }),
      prisma.subscriberSnapshot.create({ data: { channelId, count: data.subscribers } })
    ]),
  history: (channelId: string, since: Date) => Promise.all([
    prisma.channelStatsSnapshot.findMany({ where: { channelId, capturedAt: { gte: since } }, orderBy: { capturedAt: "asc" } }),
    prisma.followerSnapshot.findMany({ where: { channelId, capturedAt: { gte: since } }, orderBy: { capturedAt: "asc" } }),
    prisma.subscriberSnapshot.findMany({ where: { channelId, capturedAt: { gte: since } }, orderBy: { capturedAt: "asc" } })
  ]),
  healthHistory: (channelId: string, since: Date) =>
    prisma.healthScore.findMany({ where: { channelId, calculatedAt: { gte: since } }, orderBy: { calculatedAt: "asc" } }),
  activitiesSince: (channelId: string, since: Date) =>
    prisma.activity.findMany({ where: { channelId, occurredAt: { gte: since } }, orderBy: { occurredAt: "asc" } }),
  recentActivities: (channelId: string) => prisma.activity.findMany({ where: { channelId }, orderBy: { occurredAt: "desc" }, take: 20 }),
  upsertActivity: (channelId: string, activity: { id?: string; type: any; actorId?: string; actorName?: string; label: string; occurredAt: Date; payload?: object }) =>
    activity.id
      ? prisma.activity.upsert({
          where: { blazeActivityId: activity.id },
          update: {},
          create: { channelId, blazeActivityId: activity.id, type: activity.type, actorId: activity.actorId, actorName: activity.actorName, label: activity.label, occurredAt: activity.occurredAt, payload: activity.payload }
        })
      : prisma.activity.create({
          data: { channelId, type: activity.type, actorId: activity.actorId, actorName: activity.actorName, label: activity.label, occurredAt: activity.occurredAt, payload: activity.payload }
        }),
  saveHealth: (channelId: string, data: { score: number; grade: string; contributors: object; insight: string }) =>
    prisma.healthScore.create({ data: { channelId, ...data } }),
  latestHealth: (channelId: string) => prisma.healthScore.findFirst({ where: { channelId }, orderBy: { calculatedAt: "desc" } }),
  replaceInsights: async (channelId: string, insights: Array<{ kind: any; title: string; body: string; metadata?: object }>) => {
    await prisma.insight.deleteMany({ where: { channelId } });
    await prisma.insight.createMany({ data: insights.map((item) => ({ channelId, ...item })) });
  },
  insights: (channelId: string) => prisma.insight.findMany({ where: { channelId }, orderBy: { createdAt: "desc" } })
};

export const benchmarkRepository = {
  latestRuns: (cohort: string, take = 30) => prisma.benchmarkRun.findMany({
    where: { cohort },
    orderBy: { capturedAt: "desc" },
    take,
    include: { percentiles: true }
  }),
  createRun: (data: {
    cohort: string;
    creatorCount: number;
    distinctCreatorCount: number;
    liveCreatorCount: number;
    volatility?: number;
    confidence: number;
    observations: Array<{
      blazeChannelId: string;
      category?: string;
      isLive: boolean;
      followerCount: number;
      subscriberCount: number;
      viewerCount: number;
      vodCount: number;
      viewerFollowerRate?: number;
      subscriberFollowerRate?: number;
    }>;
    percentiles: Array<{
      metric: string;
      sampleSize: number;
      p10?: number;
      p25?: number;
      p50?: number;
      p75?: number;
      p90?: number;
      mean?: number;
      stdDev?: number;
    }>;
  }) => prisma.benchmarkRun.create({
    data: {
      cohort: data.cohort,
      creatorCount: data.creatorCount,
      distinctCreatorCount: data.distinctCreatorCount,
      liveCreatorCount: data.liveCreatorCount,
      volatility: data.volatility,
      confidence: data.confidence,
      observations: { create: data.observations },
      percentiles: { create: data.percentiles }
    },
    include: { percentiles: true }
  }),
  distinctCreatorsSince: async (since: Date) => {
    const rows = await prisma.benchmarkChannelSnapshot.findMany({
      where: { capturedAt: { gte: since } },
      distinct: ["blazeChannelId"],
      select: { blazeChannelId: true }
    });
    return rows.length;
  }
};

export const notificationRepository = {
  list: (channelId: string, take = 30) => prisma.notification.findMany({
    where: { channelId },
    orderBy: { createdAt: "desc" },
    take
  }),
  unreadCount: (channelId: string) => prisma.notification.count({ where: { channelId, readAt: null } }),
  create: (channelId: string, data: { kind: any; title: string; body: string; metadata?: object }) =>
    prisma.notification.create({ data: { channelId, ...data } }),
  createIfNew: async (channelId: string, data: { kind: any; title: string; body: string; metadata?: object }, since: Date) => {
    const existing = await prisma.notification.findFirst({
      where: { channelId, title: data.title, body: data.body, createdAt: { gte: since } }
    });
    return existing ?? prisma.notification.create({ data: { channelId, ...data } });
  },
  markRead: (channelId: string, id: string) =>
    prisma.notification.updateMany({ where: { id, channelId }, data: { readAt: new Date() } }),
  markAllRead: (channelId: string) =>
    prisma.notification.updateMany({ where: { channelId, readAt: null }, data: { readAt: new Date() } })
};
