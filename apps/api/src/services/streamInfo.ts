import { config } from "../config.js";
import { blazeApiClient } from "./blazeClient.js";

export class BlazeLiveService {
  async getStream(channelId: string) {
    const stream = await blazeApiClient.get<any>(channelId, config.BLAZE_STREAM_PATH);
    const live = await blazeApiClient.get<any>(channelId, config.BLAZE_LIVE_PATH);
    const liveStream = live.stream ?? live.liveStream ?? live.live_stream ?? {};
    const streamDetails = stream.stream ?? stream.liveStream ?? stream.live_stream ?? stream;
    const startedAtValue = live.startedAt
      ?? live.started_at
      ?? live.streamStartedAt
      ?? live.stream_started_at
      ?? liveStream.startedAt
      ?? liveStream.started_at
      ?? streamDetails.startedAt
      ?? streamDetails.started_at
      ?? streamDetails.streamStartedAt
      ?? streamDetails.stream_started_at;
    const startedAt = this.parseDate(startedAtValue);
    const reportedDuration = Math.max(
      0,
      Number(live.duration_seconds ?? live.durationSeconds ?? liveStream.duration_seconds ?? liveStream.durationSeconds ?? 0)
    );
    const elapsedDuration = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000)) : 0;

    return {
      isLive: Boolean(live.isLive ?? live.is_live ?? liveStream.isLive ?? liveStream.is_live ?? streamDetails.isLive ?? streamDetails.is_live),
      title: String(streamDetails.title ?? ""),
      category: String(streamDetails.category?.title ?? streamDetails.category?.name ?? streamDetails.category ?? ""),
      currentViewers: Number(live.viewerCount ?? live.viewer_count ?? live.currentViewers ?? 0),
      durationSeconds: Math.max(reportedDuration, elapsedDuration),
      startedAt
    };
  }

  private parseDate(value: unknown) {
    if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
}
export const blazeLiveService = new BlazeLiveService();
