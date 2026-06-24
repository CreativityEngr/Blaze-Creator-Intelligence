import type {
  CommunitySummary,
  DashboardSummary,
  GrowthSummary,
  HealthScore,
  SettingsSummary,
  NotificationSummary,
  BenchmarkResearchSummary,
  AnalyticsRange,
  AudienceIntelligenceSummary
} from "@blaze/shared";
import { getApiData, postApi } from "@/services/apiClient";

export const creatorService = {
  getDashboard: (signal?: AbortSignal) => getApiData<DashboardSummary>("/dashboard", signal),
  getCommunity: (signal?: AbortSignal) => getApiData<CommunitySummary>("/community", signal),
  getGrowth: (range: AnalyticsRange, signal?: AbortSignal) => getApiData<GrowthSummary>(`/growth?range=${range}`, signal),
  getAudienceIntelligence: (range: AnalyticsRange, signal?: AbortSignal) => getApiData<AudienceIntelligenceSummary>(`/audience?range=${range}`, signal),
  getHealthScore: (signal?: AbortSignal) => getApiData<HealthScore>("/health", signal),
  getSettings: (signal?: AbortSignal) => getApiData<SettingsSummary>("/settings", signal),
  getNotifications: (signal?: AbortSignal) => getApiData<NotificationSummary>("/notifications", signal),
  markNotificationRead: (id: string) => postApi(`/notifications/${id}/read`),
  markAllNotificationsRead: () => postApi("/notifications/read-all"),
  logout: () => postApi("/auth/logout"),
  getBenchmarkResearch: (signal?: AbortSignal) => getApiData<BenchmarkResearchSummary>("/research/benchmarks", signal)
};
