import { channelRepository, notificationRepository } from "../repositories/index.js";

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const change = (current: number, previous: number) => previous ? ((current - previous) / previous) * 100 : 0;

export class TrendDetectionService {
  async analyze(channel: { id: string }) {
    const now = Date.now();
    const [stats, followers, subscribers] = await channelRepository.history(channel.id, new Date(now - 14 * 86400_000));
    const split = new Date(now - 7 * 86400_000);
    const recentStats = stats.filter((item) => item.capturedAt >= split);
    const priorStats = stats.filter((item) => item.capturedAt < split);
    const recentFollowers = followers.filter((item) => item.capturedAt >= split);
    const priorFollowers = followers.filter((item) => item.capturedAt < split);
    const recentSubscribers = subscribers.filter((item) => item.capturedAt >= split);
    const priorSubscribers = subscribers.filter((item) => item.capturedAt < split);

    const followerDelta = this.delta(recentFollowers);
    const priorFollowerDelta = this.delta(priorFollowers);
    const subscriberDelta = this.delta(recentSubscribers);
    const viewerChange = change(
      average(recentStats.filter((item) => item.isLive).map((item) => item.viewerCount)),
      average(priorStats.filter((item) => item.isLive).map((item) => item.viewerCount))
    );
    const activeDays = new Set(recentStats.filter((item) => item.isLive).map((item) => item.capturedAt.toISOString().slice(0, 10))).size;

    const signals = [
      {
        key: "follower_velocity",
        title: followerDelta > priorFollowerDelta ? "Follower momentum is improving" : "Follower momentum is steady",
        body: `${followerDelta >= 0 ? "+" : ""}${followerDelta} followers over the latest observed week.`,
        direction: followerDelta > priorFollowerDelta ? "up" : "flat"
      },
      {
        key: "viewer_momentum",
        title: viewerChange > 10 ? "Live audience momentum is rising" : viewerChange < -10 ? "Live audience momentum softened" : "Live audience momentum is stable",
        body: `${viewerChange >= 0 ? "+" : ""}${viewerChange.toFixed(1)}% versus the previous observed week.`,
        direction: viewerChange > 10 ? "up" : viewerChange < -10 ? "down" : "flat"
      },
      {
        key: "stream_consistency",
        title: activeDays >= 3 ? "Streaming cadence is consistent" : "Streaming cadence is still forming",
        body: `${activeDays} active streaming day${activeDays === 1 ? "" : "s"} observed in the latest week.`,
        direction: activeDays >= 3 ? "up" : "flat"
      },
      {
        key: "subscriber_velocity",
        title: subscriberDelta > 0 ? "Subscriber conversion moved forward" : "Subscriber conversion is unchanged",
        body: `${subscriberDelta >= 0 ? "+" : ""}${subscriberDelta} subscribers over the latest observed week.`,
        direction: subscriberDelta > 0 ? "up" : "flat"
      }
    ];

    for (const signal of signals.filter((item) => item.direction !== "flat")) {
      await notificationRepository.createIfNew(channel.id, {
        kind: "TREND",
        title: signal.title,
        body: signal.body,
        metadata: { key: signal.key, direction: signal.direction }
      }, new Date(now - 24 * 60 * 60_000));
    }
    return signals;
  }

  private delta(rows: Array<{ count: number }>) {
    return rows.length > 1 ? rows.at(-1)!.count - rows[0].count : 0;
  }
}

export const trendDetectionService = new TrendDetectionService();
