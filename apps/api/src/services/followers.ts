import type { CommunityMember } from "@blaze/shared";
import { mockFollowers } from "../utils/mockData.js";

export interface FollowersService {
  listRecentFollowers(creatorId: string): Promise<CommunityMember[]>;
}

export class MockFollowersService implements FollowersService {
  async listRecentFollowers(_creatorId: string) {
    return mockFollowers;
  }
}

export const followersService = new MockFollowersService();
