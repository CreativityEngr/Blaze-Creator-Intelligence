import { channelRepository, notificationRepository } from "../repositories/index.js";

export class NotificationService {
  async list(channelId: string) {
    await this.refreshSummaries(channelId);
    const seenTitles = new Set<string>();
    const items = (await notificationRepository.list(channelId)).filter((item) => {
      if (item.kind === "EVENT" || seenTitles.has(item.title)) return false;
      seenTitles.add(item.title);
      return true;
    }).sort((a, b) => {
      const priority = { INSIGHT: 0, TREND: 1, SYSTEM: 2, EVENT: 3 };
      return priority[a.kind] - priority[b.kind] || b.createdAt.getTime() - a.createdAt.getTime();
    });
    const unreadCount = items.filter((item) => !item.readAt).length;
    return {
      unreadCount,
      items: items.map((item) => ({
        id: item.id,
        kind: item.kind,
        title: item.title,
        body: item.body,
        read: Boolean(item.readAt),
        createdAt: item.createdAt.toISOString()
      }))
    };
  }

  markRead(channelId: string, id: string) {
    return notificationRepository.markRead(channelId, id);
  }

  markAllRead(channelId: string) {
    return notificationRepository.markAllRead(channelId);
  }

  private async refreshSummaries(channelId: string) {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const [activities, health, history] = await Promise.all([
      channelRepository.activitiesSince(channelId, dayStart),
      channelRepository.healthHistory(channelId, new Date(Date.now() - 7 * 86400_000)),
      channelRepository.history(channelId, new Date(Date.now() - 7 * 86400_000))
    ]);
    const follows = activities.filter((item) => item.type === "FOLLOW").length;
    const subscribers = activities.filter((item) => item.type === "SUBSCRIBE").length;
    if (follows > 0) {
      await notificationRepository.createIfNew(channelId, {
        kind: "INSIGHT",
        title: `${follows} follower${follows === 1 ? "" : "s"} gained today`,
        body: "Audience growth is moving. Review the stream and promotion pattern that preceded these follows.",
        metadata: { summary: "daily_followers", count: follows }
      }, dayStart);
    }
    if (subscribers > 0) {
      await notificationRepository.createIfNew(channelId, {
        kind: "INSIGHT",
        title: `${subscribers} subscriber${subscribers === 1 ? "" : "s"} gained today`,
        body: "Conversion improved today. Reinforce the moments that made the value of subscribing clear.",
        metadata: { summary: "daily_subscribers", count: subscribers }
      }, dayStart);
    }
    if (health.length > 1) {
      const movement = health.at(-1)!.score - health[0].score;
      if (Math.abs(movement) >= 2) {
        await notificationRepository.createIfNew(channelId, {
          kind: "INSIGHT",
          title: `Health Score ${movement > 0 ? "improved" : "declined"} ${Math.abs(movement)} points`,
          body: movement > 0 ? "Recent channel behavior is strengthening overall creator health." : "Review the weakest contributor before the next stream.",
          metadata: { summary: "health_movement", movement }
        }, dayStart);
      }
    }
    const live = history[0].filter((item) => item.isLive);
    if (live.length > 2) {
      const latest = live.at(-1)!;
      const baselineRows = live.slice(0, -1);
      const baseline = baselineRows.reduce((sum, item) => sum + item.viewerCount, 0) / baselineRows.length;
      if (baseline > 0 && latest.viewerCount >= baseline * 1.25) {
        await notificationRepository.createIfNew(channelId, {
          kind: "INSIGHT",
          title: "Stream outperformed recent average",
          body: `${latest.viewerCount} viewers versus a recent live average of ${baseline.toFixed(1)}.`,
          metadata: { summary: "stream_outperformance", viewers: latest.viewerCount, baseline }
        }, dayStart);
      }
    }
  }
}

export const notificationService = new NotificationService();
