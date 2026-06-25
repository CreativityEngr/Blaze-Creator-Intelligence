import { getHealthScoreStatus, type Activity, type AnalyticsRange, type AudienceIntelligenceSummary, type CommunityMember, type DashboardSummary, type DecisionInsight, type GrowthPoint, type HealthScore } from "@blaze/shared";
import { channelRepository } from "../repositories/index.js";
import { blazeActivityService } from "./activities.js";
import { blazeChannelService } from "./channelStats.js";
import { blazeFollowerService } from "./followers.js";
import { blazeLiveService } from "./streamInfo.js";
import { blazeSubscriberService } from "./subscribers.js";
import { trendDetectionService } from "./trendDetection.js";

const percent = (current: number, previous: number) => previous ? ((current - previous) / previous) * 100 : 0;
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export class HealthScoreEngine {
  calculate(input: { followerGrowth: number; subscriberGrowth: number; viewers: number; activities: number }) {
    const contributors = {
      Growth: clamp(70 + input.followerGrowth * 5),
      Subscribers: clamp(70 + input.subscriberGrowth * 5),
      Engagement: clamp(Math.min(100, 55 + Math.log10(input.viewers + 1) * 12)),
      Community: clamp(Math.min(100, 55 + input.activities * 3))
    };
    const score = Math.round(contributors.Growth * .3 + contributors.Subscribers * .3 + contributors.Engagement * .25 + contributors.Community * .15);
    const weakest = Object.entries(contributors).sort((a, b) => a[1] - b[1])[0][0];
    return { score, grade: getHealthScoreStatus(score), contributors, insight: `${weakest} is the clearest opportunity to improve channel health.` };
  }
}

export class CreatorIntelligenceService {
  generate(input: {
    followerGrowth: number;
    subscriberGrowth: number;
    viewerGrowth: number;
    activities: number;
    activeDays: number;
    bestHour?: number;
    viewerEfficiency: number;
  }): DecisionInsight[] {
    const followerDirection = input.followerGrowth > 1 ? "up" : input.followerGrowth < -1 ? "down" : "flat";
    const viewerDirection = input.viewerGrowth > 10 ? "up" : input.viewerGrowth < -10 ? "down" : "flat";
    return [
      {
        label: followerDirection === "up" ? "Audience growth is accelerating" : followerDirection === "down" ? "Audience growth has softened" : "Audience activity remains stable",
        what: followerDirection === "up"
          ? "Recent channel history shows a clear improvement in follower momentum."
          : followerDirection === "down"
            ? "Recent follower activity is below the earlier pace in this observation window."
            : "Follower activity is holding steady without a meaningful directional shift.",
        why: followerDirection === "flat"
          ? "Additional observations are required before a directional trend emerges."
          : "Follower movement indicates how effectively discovery is becoming a durable audience.",
        next: followerDirection === "up"
          ? "Repeat the stream format and promotion pattern that produced the latest gains."
          : "Use the next three streams to test one consistent title, category, and start-time pattern.",
        direction: followerDirection
      },
      {
        label: viewerDirection === "up" ? "Live attention is strengthening" : viewerDirection === "down" ? "Live attention needs reinforcement" : "Viewer response remains consistent",
        what: viewerDirection === "up"
          ? "The audience is converting into live attention more efficiently."
          : viewerDirection === "down"
            ? "Live audience response has eased compared with the earlier observation window."
            : "Viewer response is stable, with no material change in current observations.",
        why: "Viewer efficiency shows whether the existing audience is turning into live attention, independent of channel size.",
        next: viewerDirection === "down"
          ? "Tighten the first 15 minutes and compare retention across the next two broadcasts."
          : "Preserve the strongest opening format and invite viewers to follow before the midpoint of the stream.",
        direction: viewerDirection
      },
      {
        label: input.activeDays >= 3 ? "Stream cadence is building audience habit" : "Stream cadence is still developing",
        what: input.activeDays >= 3
          ? "Your recent schedule is creating repeated opportunities for the audience to return."
          : "The current observation window does not yet show a repeatable broadcast rhythm.",
        why: input.activeDays >= 3 ? "Repeated availability gives viewers more opportunities to return and convert." : "Limited cadence makes audience momentum harder to distinguish from one-off activity.",
        next: input.bestHour === undefined ? "Hold a repeatable schedule while more history is collected." : `Prioritize starts near ${this.formatHour(input.bestHour)}, the strongest observed viewer window.`,
        direction: input.activeDays >= 3 ? "up" : "flat"
      }
    ];
  }

  private formatHour(hour: number) {
    return new Intl.DateTimeFormat("en", { hour: "numeric", timeZone: "Africa/Lagos" }).format(new Date(Date.UTC(2026, 0, 1, hour)));
  }
}

export class CreatorInsightsService {
  private health = new HealthScoreEngine();
  private intelligence = new CreatorIntelligenceService();

  async getDashboard(channel: any): Promise<DashboardSummary> {
    const [history, activities, growth] = await Promise.all([
      channelRepository.history(channel.id, new Date(Date.now() - 30 * 86400_000)),
      channelRepository.recentActivities(channel.id),
      this.getGrowth(channel)
    ]);
    const latestStreamSnapshot = history[0].at(-1);
    const latestFollowerSnapshot = history[1].at(-1);
    const latestSubscriberSnapshot = history[2].at(-1);
    const [stats, stream] = await Promise.all([
      this.withFallback(
        () => blazeChannelService.getStats(channel.blazeChannelId),
        {
          followers: latestFollowerSnapshot?.count ?? 0,
          subscribers: latestSubscriberSnapshot?.count ?? 0,
          viewers: latestStreamSnapshot?.viewerCount ?? 0
        },
        "channel stats"
      ),
      this.withFallback(
        () => blazeLiveService.getStream(channel.blazeChannelId),
        {
          isLive: latestStreamSnapshot?.isLive ?? false,
          title: latestStreamSnapshot?.streamTitle ?? "",
          category: latestStreamSnapshot?.streamCategory ?? "",
          currentViewers: latestStreamSnapshot?.viewerCount ?? 0,
          durationSeconds: 0,
          startedAt: latestStreamSnapshot?.streamStartedAt ?? undefined
        },
        "live stream"
      )
    ]);
    const currentInsights = await this.buildDecisionInsights(channel, growth);
    const lastLiveSnapshot = history[0].filter((item) => item.isLive).at(-1);
    const lastActivity = activities[0];
    const streamStartedAt = stream.isLive ? stream.startedAt ?? this.inferCurrentStreamStart(history[0], activities) : undefined;
    const liveDurationSeconds = streamStartedAt
      ? Math.max(stream.durationSeconds, Math.floor((Date.now() - streamStartedAt.getTime()) / 1000))
      : stream.durationSeconds;

    return {
      creator: { id: channel.id, blazeId: channel.blazeChannelId, displayName: channel.displayName, avatarUrl: channel.avatarUrl ?? "", createdAt: channel.createdAt.toISOString() },
      stream: {
        ...stream,
        durationSeconds: Math.max(0, liveDurationSeconds),
        startedAt: streamStartedAt?.toISOString(),
        followers: Number(stats.followers),
        subscribers: Number(stats.subscribers)
      },
      channelStatus: {
        summary: stream.isLive
          ? `${stream.currentViewers.toLocaleString()} viewers are watching ${stream.category}.`
          : lastLiveSnapshot
            ? `Your channel is ready. The last observed stream reached ${lastLiveSnapshot.viewerCount.toLocaleString()} viewers.`
            : "Your channel is ready for its next stream.",
        readiness: stream.isLive ? "Broadcast in progress" : "Ready to stream",
        lastStreamTitle: lastLiveSnapshot?.streamTitle ?? null,
        lastCategory: lastLiveSnapshot?.streamCategory ?? null,
        lastViewerCount: lastLiveSnapshot?.viewerCount ?? null,
        lastStreamAt: lastLiveSnapshot?.capturedAt.toISOString() ?? null,
        lastActivity: lastActivity ? this.formatActivityLabel(lastActivity.label || lastActivity.type) : null,
        lastActivityAt: lastActivity?.occurredAt.toISOString() ?? null
      },
      creatorBrief: currentInsights,
      followerDelta: await this.delta(channel.id, "followers"),
      subscriberDelta: await this.delta(channel.id, "subscribers")
    };
  }

  private async withFallback<T>(producer: () => Promise<T>, fallback: T, label: string) {
    try {
      return await producer();
    } catch (error) {
      console.warn(`Using persisted ${label} fallback`, error);
      return fallback;
    }
  }

  private inferCurrentStreamStart(
    snapshots: Array<{ isLive: boolean; streamStartedAt: Date | null; capturedAt: Date }>,
    activities: Array<{ type: string; occurredAt: Date }>
  ) {
    const latestStreamEvent = activities.find((activity) => activity.type === "STREAM_STARTED" || activity.type === "STREAM_ENDED");
    if (latestStreamEvent?.type === "STREAM_STARTED") return latestStreamEvent.occurredAt;

    let inferred: Date | undefined;
    for (let index = snapshots.length - 1; index >= 0; index -= 1) {
      const snapshot = snapshots[index];
      if (!snapshot.isLive) break;
      inferred = snapshot.streamStartedAt ?? snapshot.capturedAt;
    }
    return inferred;
  }

  async getCommunity(channel: any) {
    const [activities, followers, subscribers, persistedActivities] = await Promise.all([
      blazeActivityService.list(channel.blazeChannelId),
      blazeFollowerService.list(channel.blazeChannelId),
      blazeSubscriberService.list(channel.blazeChannelId),
      channelRepository.recentActivities(channel.id)
    ]);
    const members = (rows: any[], subscriber = false): CommunityMember[] => rows.map((row) => {
      const id = String(row.id ?? row.userId ?? row.user_id ?? "");
      return {
        id,
        displayName: String(row.displayName ?? row.display_name ?? row.username ?? row.slug ?? this.identityFromId(id)),
        joinedAt: String(row.followedAt ?? row.subscribedAt ?? row.createdAt ?? row.followed_at ?? row.subscribed_at ?? row.created_at ?? ""),
        value: subscriber ? String(row.subscriptionInfo?.tier ?? row.tier ?? "Subscriber") : "Follower"
      };
    });
    const persistedByActor = new Map(
      persistedActivities
        .filter((item) => item.actorId && item.actorName)
        .map((item) => [item.actorId!, item.actorName!])
    );
    return {
      recentActivity: activities.map((row): Activity => {
        const actorId = String(row.info?.userId ?? row.actor?.id ?? row.actorId ?? row.actor_id ?? "");
        return {
          id: String(row.id),
          creatorId: channel.id,
          type: row.type ?? "community_post",
          actorId,
          actorName: String(
            row.info?.displayName
              ?? row.actor?.displayName
              ?? row.actor?.display_name
              ?? row.actorName
              ?? row.actor_name
              ?? persistedByActor.get(actorId)
              ?? this.identityFromId(actorId)
          ),
          label: this.formatActivityLabel(String(row.label ?? row.type ?? "Activity")),
          createdAt: String(row.createdAt ?? row.created_at ?? new Date().toISOString())
        };
      }),
      followers: members(followers),
      subscribers: members(subscribers, true)
    };
  }

  async getGrowth(channel: any, range: AnalyticsRange = "30d") {
    const since = this.rangeStart(range, channel.createdAt);
    const [[stats, followers, subscribers], health, activities] = await Promise.all([
      channelRepository.history(channel.id, since),
      channelRepository.healthHistory(channel.id, since),
      channelRepository.activitiesSince(channel.id, since)
    ]);
    const byDay = new Map<string, GrowthPoint>();
    stats.forEach((item) => {
      const date = item.capturedAt.toISOString().slice(0, 10);
      const existing = byDay.get(date);
      if (existing) {
        existing.viewers = Math.max(existing.viewers, item.viewerCount);
      } else {
        byDay.set(date, { date, followers: 0, subscribers: 0, viewers: item.viewerCount });
      }
    });
    followers.forEach((item) => { const point = byDay.get(item.capturedAt.toISOString().slice(0, 10)); if (point) point.followers = item.count; });
    subscribers.forEach((item) => { const point = byDay.get(item.capturedAt.toISOString().slice(0, 10)); if (point) point.subscribers = item.count; });
    health.forEach((item) => { const point = byDay.get(item.calculatedAt.toISOString().slice(0, 10)); if (point) point.healthScore = item.score; });
    activities.forEach((item) => {
      const key = item.occurredAt.toISOString().slice(0, 10);
      const point = byDay.get(key);
      if (point) point.activities = (point.activities ?? 0) + 1;
    });
    const points = [...byDay.values()];
    const growth = (key: keyof GrowthPoint) => {
      const eligible = key === "viewers" ? points.filter((point) => point.viewers > 0) : points;
      if (eligible.length <= 1) return null;
      const current = Number(eligible.at(-1)![key]);
      const previous = Number(eligible[0][key]);
      if (previous === 0) return current === 0 ? 0 : null;
      return percent(current, previous);
    };
    const readout = (label: string, value: number | null) => ({
      label,
      value: value === null ? "Developing" : `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`,
      detail: value === null ? "More history required" : `${this.rangeLabel(range)} window`
    });
    return { range, points, readout: [
      readout("Follower lift", growth("followers")),
      readout("Subscriber lift", growth("subscribers")),
      readout("Viewer lift", growth("viewers"))
    ] };
  }

  async getAudienceIntelligence(channel: any, range: AnalyticsRange = "30d"): Promise<AudienceIntelligenceSummary> {
    const growth = await this.getGrowth(channel, range);
    const since = this.rangeStart(range, channel.createdAt);
    const [activities, history] = await Promise.all([
      channelRepository.activitiesSince(channel.id, since),
      channelRepository.history(channel.id, since)
    ]);
    const latest = growth.points.at(-1);
    const first = growth.points[0];
    const liveSnapshots = history[0].filter((item) => item.isLive);
    const averageLiveViewers = liveSnapshots.length ? liveSnapshots.reduce((sum, item) => sum + item.viewerCount, 0) / liveSnapshots.length : 0;
    const hasFollowerBase = Boolean(latest?.followers);
    const viewerEfficiency = hasFollowerBase ? (averageLiveViewers / latest!.followers) * 100 : null;
    const subscriberConversion = hasFollowerBase ? (latest!.subscribers / latest!.followers) * 100 : null;
    const uniqueActors = new Set(activities.map((item) => item.actorId).filter(Boolean)).size;
    const streamSessions = new Set(liveSnapshots.map((item) => item.streamStartedAt?.toISOString()).filter(Boolean)).size;
    const engagementPerStream = streamSessions ? activities.length / streamSessions : null;
    const momentum = first && latest && first.followers > 0 ? percent(latest.followers, first.followers) : null;
    const observationPeriod = this.rangeLabel(range);
    const confidence = this.confidenceLabel(streamSessions, liveSnapshots.length);
    return {
      range,
      metrics: [
        {
          label: "Viewer-to-follower efficiency",
          value: viewerEfficiency === null ? "Not available" : `${viewerEfficiency.toFixed(1)}%`,
          detail: viewerEfficiency === null ? "A follower base is required" : "Live viewers per 100 followers",
          direction: viewerEfficiency !== null && viewerEfficiency > 5 ? "up" : "flat",
          confidence, sampleSize: streamSessions, observationPeriod
        },
        {
          label: "Subscriber conversion",
          value: subscriberConversion === null ? "Not available" : `${subscriberConversion.toFixed(1)}%`,
          detail: subscriberConversion === null ? "A follower base is required" : "Subscribers per 100 followers",
          direction: subscriberConversion !== null && subscriberConversion > 0 ? "up" : "flat",
          confidence, sampleSize: streamSessions, observationPeriod
        },
        {
          label: "Engagement per stream",
          value: engagementPerStream === null ? "Developing" : engagementPerStream.toFixed(1),
          detail: engagementPerStream === null ? "No complete stream observed" : `${uniqueActors} unique participants`,
          direction: engagementPerStream !== null && engagementPerStream > 1 ? "up" : "flat",
          confidence, sampleSize: streamSessions, observationPeriod
        },
        {
          label: "Audience growth momentum",
          value: momentum === null ? "Developing" : `${momentum >= 0 ? "+" : ""}${momentum.toFixed(1)}%`,
          detail: momentum === null ? "More follower history required" : "Follower movement",
          direction: momentum !== null && momentum > 1 ? "up" : momentum !== null && momentum < -1 ? "down" : "flat",
          confidence, sampleSize: growth.points.length, observationPeriod
        }
      ],
      activityByDay: growth.points.map((point) => ({ date: point.date, count: point.activities ?? 0 }))
    };
  }

  async getHealthScore(channel: any): Promise<HealthScore> {
    const growth = await this.getGrowth(channel);
    const activities = await channelRepository.recentActivities(channel.id);
    const value = (label: string) => this.readoutNumber(growth.readout.find((item) => item.label.startsWith(label))?.value);
    const result = this.health.calculate({ followerGrowth: value("Follower"), subscriberGrowth: value("Subscriber"), viewers: growth.points.at(-1)?.viewers ?? 0, activities: activities.length });
    const history = await channelRepository.healthHistory(channel.id, new Date(Date.now() - 30 * 86400_000));
    const weeklyBaseline = history.find((item) => item.calculatedAt >= new Date(Date.now() - 7 * 86400_000))?.score ?? result.score;
    const monthlyBaseline = history[0]?.score ?? result.score;
    const weeklyMovement = result.score - weeklyBaseline;
    const monthlyMovement = result.score - monthlyBaseline;
    await channelRepository.saveHealth(channel.id, result);
    return {
      id: `health:${channel.id}`, creatorId: channel.id, score: result.score, status: result.grade, grade: result.grade,
      movement: { weekly: weeklyMovement, monthly: monthlyMovement },
      healthTrend: weeklyMovement > 0 ? "Improving" : weeklyMovement < 0 ? "Declining" : "Stable",
      updatedAt: new Date().toISOString(), summary: `Channel health is ${result.grade.toLowerCase()} based on growth, subscribers, engagement, and community activity.`,
      priorityInsight: result.insight,
      breakdown: [
        {
          label: "Growth",
          change: value("Follower"),
          direction: this.direction(value("Follower")),
          explanation: "Follower movement shows whether discovery is becoming a durable audience."
        },
        {
          label: "Subscribers",
          change: value("Subscriber"),
          direction: this.direction(value("Subscriber")),
          explanation: "Subscriber movement reflects how effectively channel value converts."
        },
        {
          label: "Engagement",
          change: value("Viewer"),
          direction: this.direction(value("Viewer")),
          explanation: "Viewer movement indicates whether live attention is strengthening."
        },
        {
          label: "Community",
          change: null,
          direction: activities.length > 0 ? "up" : "flat",
          explanation: activities.length > 0
            ? `${activities.length} recent community signal${activities.length === 1 ? "" : "s"} contributed to channel health.`
            : "No recent community activity was available to establish movement."
        }
      ]
    };
  }

  async refreshInsights(channel: any) {
    const growth = await this.getGrowth(channel);
    const trends = await trendDetectionService.analyze(channel);
    const generated = await this.buildDecisionInsights(channel, growth);
    await channelRepository.replaceInsights(channel.id, [
      ...generated.map((item) => ({
        kind: "CREATOR_BRIEF",
        title: item.label,
        body: item.what,
        metadata: { why: item.why, next: item.next, direction: item.direction }
      })),
      ...trends.slice(0, 2).map((trend) => ({
        kind: "GROWTH",
        title: trend.title,
        body: trend.body,
        metadata: { direction: trend.direction, key: trend.key }
      }))
    ]);
  }

  getSettings() {
    return Promise.resolve({ integrations: [
      { id: "oauth" as const, title: "Blaze connection", description: "Your creator identity and channel are connected securely." },
      { id: "api" as const, title: "Channel data", description: "Your latest creator activity and performance signals are available." },
      { id: "access" as const, title: "Secure access", description: "Your account connection remains private and protected." }
    ] });
  }

  private async delta(channelId: string, kind: "followers" | "subscribers") {
    const history = await channelRepository.history(channelId, new Date(Date.now() - 86400_000));
    const rows = kind === "followers" ? history[1] : history[2];
    const delta = rows.length > 1 ? rows.at(-1)!.count - rows[0].count : 0;
    return `${delta >= 0 ? "+" : ""}${delta.toLocaleString()} today`;
  }

  private async buildDecisionInsights(channel: any, growth: Awaited<ReturnType<CreatorInsightsService["getGrowth"]>>) {
    const value = (index: number) => this.readoutNumber(growth.readout[index]?.value);
    const since = this.rangeStart(growth.range, channel.createdAt);
    const [stats, activities] = await Promise.all([
      channelRepository.history(channel.id, since).then((rows) => rows[0]),
      channelRepository.activitiesSince(channel.id, since)
    ]);
    const live = stats.filter((item) => item.isLive);
    const activeDays = new Set(live.map((item) => item.capturedAt.toISOString().slice(0, 10))).size;
    const hourly = new Map<number, number[]>();
    live.forEach((item) => {
      const hour = item.capturedAt.getUTCHours();
      hourly.set(hour, [...(hourly.get(hour) ?? []), item.viewerCount]);
    });
    const bestHour = [...hourly.entries()]
      .map(([hour, viewers]) => ({ hour, average: viewers.reduce((sum, count) => sum + count, 0) / viewers.length }))
      .sort((a, b) => b.average - a.average)[0]?.hour;
    const latest = growth.points.at(-1);
    const averageLiveViewers = live.length ? live.reduce((sum, item) => sum + item.viewerCount, 0) / live.length : 0;
    const viewerEfficiency = latest?.followers ? (averageLiveViewers / latest.followers) * 100 : averageLiveViewers;
    return this.intelligence.generate({
      followerGrowth: value(0),
      subscriberGrowth: value(1),
      viewerGrowth: value(2),
      activities: activities.length,
      activeDays,
      bestHour,
      viewerEfficiency
    });
  }

  private rangeStart(range: AnalyticsRange, createdAt: Date) {
    if (range === "all") return createdAt;
    return new Date(Date.now() - (range === "7d" ? 7 : 30) * 86400_000);
  }

  private rangeLabel(range: AnalyticsRange) {
    return range === "7d" ? "7 day" : range === "30d" ? "30 day" : "All-time";
  }

  private confidenceLabel(streamSessions: number, snapshotCount: number): AudienceIntelligenceSummary["metrics"][number]["confidence"] {
    if (streamSessions >= 12 && snapshotCount >= 48) return "High confidence";
    if (streamSessions >= 6 && snapshotCount >= 24) return "Moderate confidence";
    if (streamSessions >= 2 && snapshotCount >= 8) return "Emerging signal";
    return "Low confidence";
  }

  private direction(value: number): "up" | "down" | "flat" {
    return value > 0 ? "up" : value < 0 ? "down" : "flat";
  }

  private readoutNumber(value?: string) {
    const parsed = Number(value?.replace(/[+%]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private formatActivityLabel(value: unknown) {
    const normalized = String(value ?? "").trim().toLowerCase();
    const known: Record<string, string> = {
      "stream.offline": "Stream ended",
      "stream.ended": "Stream ended",
      "stream.online": "Stream went live",
      "stream.started": "Stream went live",
      "channel.follow": "Followed your channel",
      "follow": "Followed your channel",
      "channel.subscribe": "Subscribed to your channel",
      "subscribe": "Subscribed to your channel",
      "renewal": "Renewed a subscription"
    };

    if (known[normalized]) return known[normalized];

    const readable = normalized.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
    return readable ? `${readable.charAt(0).toUpperCase()}${readable.slice(1)}` : "Community activity";
  }

  private identityFromId(id: string) {
    return id ? `Creator ${id.slice(0, 8)}` : "Unknown creator";
  }
}

export const creatorInsightsService = new CreatorInsightsService();
