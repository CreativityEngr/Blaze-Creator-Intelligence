import type { CommunityMember } from "@blaze/shared";
import { mockSubscribers } from "../utils/mockData.js";

export interface SubscribersService {
  listRecentSubscribers(creatorId: string): Promise<CommunityMember[]>;
}

export class MockSubscribersService implements SubscribersService {
  async listRecentSubscribers(_creatorId: string) {
    return mockSubscribers;
  }
}

export const subscribersService = new MockSubscribersService();
