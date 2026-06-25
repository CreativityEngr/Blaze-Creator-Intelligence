import { config } from "../config.js";
import { channelRepository } from "../repositories/index.js";
import { blazeChannelService } from "../services/channelStats.js";
import { creatorInsightsService } from "../services/creatorInsights.js";
import { blazeLiveService } from "../services/streamInfo.js";

let timer: NodeJS.Timeout | undefined;
let isRunning = false;

export async function syncCreatorSnapshots() {
  if (isRunning) return;
  isRunning = true;
  try {
  const channels = await channelRepository.listAll();
  for (const channel of channels) {
    if (!channel.credential) continue;
    try {
      await syncCreatorChannel(channel);
    } catch (error) {
      console.error(`Snapshot sync failed for channel ${channel.id}`, error);
    }
  }
  } finally {
    isRunning = false;
  }
}

export async function syncCreatorChannel(channel: { id: string; blazeChannelId: string }) {
  const [stats, live] = await Promise.all([
    blazeChannelService.getStats(channel.blazeChannelId),
    blazeLiveService.getStream(channel.blazeChannelId)
  ]);
  await channelRepository.addSnapshot(channel.id, {
    viewers: live.currentViewers,
    followers: Number(stats.followers),
    subscribers: Number(stats.subscribers),
    isLive: live.isLive,
    title: live.title,
    category: live.category,
    startedAt: live.startedAt
  });
  await creatorInsightsService.refreshInsights(channel);
  await creatorInsightsService.getHealthScore(channel);
}

export function startSnapshotEngine() {
  const run = () => {
    void syncCreatorSnapshots().catch((error) => {
      console.error("Snapshot engine failed", error);
    });
  };
  run();
  timer = setInterval(run, config.SNAPSHOT_INTERVAL_MINUTES * 60_000);
  return () => timer && clearInterval(timer);
}
