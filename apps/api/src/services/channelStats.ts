import type { Snapshot } from "@blaze/shared";
import { mockCreator, mockStream } from "../utils/mockData.js";

export interface ChannelStatsService {
  getLatestSnapshot(creatorId: string): Promise<Snapshot>;
}

export class MockChannelStatsService implements ChannelStatsService {
  async getLatestSnapshot(creatorId: string) {
    return {
      id: "snapshot_01",
      creatorId,
      followerCount: mockStream.followers,
      subscriberCount: mockStream.subscribers,
      viewerCount: mockStream.currentViewers,
      createdAt: new Date().toISOString()
    };
  }
}

export const channelStatsService = new MockChannelStatsService();
export const defaultCreatorId = mockCreator.id;
