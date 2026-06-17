import type { CommunitySummary, DashboardSummary, GrowthSummary, HealthScore } from "@blaze/shared";
import { activitiesService } from "./activities.js";
import { followersService } from "./followers.js";
import { streamInfoService } from "./streamInfo.js";
import { subscribersService } from "./subscribers.js";
import { mockCreator, mockGrowthPoints, mockHealthScore } from "../utils/mockData.js";

export interface CreatorInsightsService {
  getDashboard(): Promise<DashboardSummary>;
  getCommunity(): Promise<CommunitySummary>;
  getGrowth(): Promise<GrowthSummary>;
  getHealthScore(): Promise<HealthScore>;
}

export class MockCreatorInsightsService implements CreatorInsightsService {
  async getDashboard() {
    return {
      creator: mockCreator,
      stream: await streamInfoService.getCurrentStream(mockCreator.id)
    };
  }

  async getCommunity() {
    return {
      recentActivity: await activitiesService.listRecentActivities(mockCreator.id),
      followers: await followersService.listRecentFollowers(mockCreator.id),
      subscribers: await subscribersService.listRecentSubscribers(mockCreator.id)
    };
  }

  async getGrowth() {
    return {
      points: mockGrowthPoints
    };
  }

  async getHealthScore() {
    return mockHealthScore;
  }
}

export const creatorInsightsService = new MockCreatorInsightsService();
