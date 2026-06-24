import { config } from "../config.js";
import { benchmarkRepository } from "../repositories/index.js";
import { blazeAppAuthService } from "./blazeAppAuth.js";

type Observation = {
  blazeChannelId: string;
  category?: string;
  isLive: boolean;
  followerCount: number;
  subscriberCount: number;
  viewerCount: number;
  vodCount: number;
  viewerFollowerRate?: number;
  subscriberFollowerRate?: number;
};

type DirectoryChannel = {
  id: string;
  isLive?: boolean;
  followerCount?: number;
  category?: { name?: string; title?: string };
};

const metrics: Array<[string, (row: Observation) => number | undefined]> = [
  ["followers", (row) => row.followerCount],
  ["subscribers", (row) => row.subscriberCount],
  ["viewers", (row) => row.viewerCount],
  ["vod_count", (row) => row.vodCount],
  ["viewer_follower_rate", (row) => row.viewerFollowerRate],
  ["subscriber_follower_rate", (row) => row.subscriberFollowerRate]
];

function summarize(metric: string, values: Array<number | undefined>) {
  const sorted = values.filter((value): value is number => Number.isFinite(value)).sort((a, b) => a - b);
  const pick = (position: number) => sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * position))];
  const mean = sorted.length ? sorted.reduce((sum, value) => sum + value, 0) / sorted.length : undefined;
  const stdDev = mean === undefined ? undefined : Math.sqrt(sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / sorted.length);
  return {
    metric,
    sampleSize: sorted.length,
    p10: pick(.1),
    p25: pick(.25),
    p50: pick(.5),
    p75: pick(.75),
    p90: pick(.9),
    mean,
    stdDev
  };
}

export class BenchmarkResearchService {
  async collect() {
    const token = await blazeAppAuthService.getAccessToken();
    const channels = await this.listLiveChannels(token);
    const observations: Observation[] = [];
    for (let index = 0; index < channels.length; index += 5) {
      const batch = channels.slice(index, index + 5);
      observations.push(...await Promise.all(batch.map((channel: DirectoryChannel) => this.observe(token, channel))));
    }
    const percentiles = metrics.map(([metric, selector]) => summarize(metric, observations.map(selector)));
    const history = await benchmarkRepository.latestRuns("live", 14);
    const previousMedian = history[0]?.percentiles.find((item) => item.metric === "followers")?.p50;
    const currentMedian = percentiles.find((item) => item.metric === "followers")?.p50;
    const volatility = previousMedian && currentMedian !== undefined
      ? Math.abs(currentMedian - previousMedian) / Math.max(1, previousMedian)
      : undefined;
    const distinctCreatorCount = await benchmarkRepository.distinctCreatorsSince(new Date(Date.now() - 30 * 86400_000));
    const confidence = this.confidence(observations.length, distinctCreatorCount, history.length + 1, volatility);
    return benchmarkRepository.createRun({
      cohort: "live",
      creatorCount: observations.length,
      distinctCreatorCount: Math.max(distinctCreatorCount, new Set(observations.map((item) => item.blazeChannelId)).size),
      liveCreatorCount: observations.filter((item) => item.isLive).length,
      volatility,
      confidence,
      observations,
      percentiles
    });
  }

  async summary() {
    const runs = await benchmarkRepository.latestRuns("live", 30);
    const latest = runs[0];
    return {
      status: latest ? "collecting" : "awaiting-data",
      capturedAt: latest?.capturedAt.toISOString(),
      creatorCount: latest?.creatorCount ?? 0,
      distinctCreatorCount: latest?.distinctCreatorCount ?? 0,
      volatility: latest?.volatility ?? null,
      confidence: latest?.confidence ?? 0,
      runCount: runs.length,
      researchReady: runs.length >= 42 && (latest?.distinctCreatorCount ?? 0) >= 30,
      percentiles: latest?.percentiles.map((item) => ({
        metric: item.metric,
        sampleSize: item.sampleSize,
        p25: item.p25,
        median: item.p50,
        p75: item.p75,
        p90: item.p90
      })) ?? []
    };
  }

  private async listLiveChannels(token: string) {
    const result = await this.get(token, "/v1/channels", { type: "live", limit: String(Math.min(20, config.BENCHMARK_MAX_CHANNELS)) });
    return (result.rows ?? []).slice(0, config.BENCHMARK_MAX_CHANNELS);
  }

  private async observe(token: string, channel: DirectoryChannel): Promise<Observation> {
    const [stats, vods] = await Promise.all([
      this.get(token, "/v1/channels/stats", { channelId: channel.id }),
      this.get(token, "/v1/channels/vods", { channelId: channel.id, limit: "20", orderBy: "most_recent" })
    ]);
    const followers = Number(stats.followerCount ?? channel.followerCount ?? 0);
    const subscribers = Number(stats.subscriberCount ?? 0);
    const viewers = Number(stats.viewerCount ?? 0);
    return {
      blazeChannelId: String(channel.id),
      category: channel.category?.name ?? channel.category?.title,
      isLive: Boolean(channel.isLive),
      followerCount: followers,
      subscriberCount: subscribers,
      viewerCount: viewers,
      vodCount: Number(vods.count ?? vods.rows?.length ?? 0),
      viewerFollowerRate: followers ? viewers / followers : undefined,
      subscriberFollowerRate: followers ? subscribers / followers : undefined
    };
  }

  private async get(token: string, path: string, query: Record<string, string>) {
    const url = new URL(path, config.BLAZE_API_BASE_URL);
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": config.BLAZE_OAUTH_CLIENT_ID,
        Accept: "application/json"
      }
    });
    if (!response.ok) throw new Error(`Blaze benchmark request failed (${response.status})`);
    const body = await response.json() as any;
    return body.data ?? body;
  }

  private confidence(sampleSize: number, distinctCreators: number, runCount: number, volatility?: number) {
    const sample = Math.min(1, sampleSize / 30);
    const distinct = Math.min(1, distinctCreators / 30);
    const history = Math.min(1, runCount / 42);
    const stability = volatility === undefined ? .5 : Math.max(0, 1 - Math.min(1, volatility));
    return Number((sample * .3 + distinct * .25 + history * .3 + stability * .15).toFixed(3));
  }
}

export const benchmarkResearchService = new BenchmarkResearchService();
