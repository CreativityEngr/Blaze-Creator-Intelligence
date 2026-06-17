import type { StreamStatus } from "@blaze/shared";
import { mockStream } from "../utils/mockData.js";

export interface LiveStatsService {
  getLiveStatus(creatorId: string): Promise<Pick<StreamStatus, "isLive" | "currentViewers" | "durationSeconds">>;
}

export class MockLiveStatsService implements LiveStatsService {
  async getLiveStatus(_creatorId: string) {
    return {
      isLive: mockStream.isLive,
      currentViewers: mockStream.currentViewers,
      durationSeconds: mockStream.durationSeconds
    };
  }
}

export const liveStatsService = new MockLiveStatsService();
