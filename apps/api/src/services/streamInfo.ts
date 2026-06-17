import type { StreamStatus } from "@blaze/shared";
import { mockStream } from "../utils/mockData.js";

export interface StreamInfoService {
  getCurrentStream(creatorId: string): Promise<StreamStatus>;
}

export class MockStreamInfoService implements StreamInfoService {
  async getCurrentStream(_creatorId: string) {
    return mockStream;
  }
}

export const streamInfoService = new MockStreamInfoService();
