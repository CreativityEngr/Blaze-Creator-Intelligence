import type { Activity } from "@blaze/shared";
import { mockActivities } from "../utils/mockData.js";

export interface ActivitiesService {
  listRecentActivities(creatorId: string): Promise<Activity[]>;
}

export class MockActivitiesService implements ActivitiesService {
  async listRecentActivities(_creatorId: string) {
    return mockActivities;
  }
}

export const activitiesService = new MockActivitiesService();
