import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creatorService } from "@/services/creatorService";
import type { AnalyticsRange } from "@blaze/shared";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: ({ signal }) => creatorService.getDashboard(signal),
    staleTime: 0,
    refetchOnMount: "always"
  });
}

export function useCommunity() {
  return useQuery({
    queryKey: ["community"],
    queryFn: ({ signal }) => creatorService.getCommunity(signal),
    staleTime: 0,
    refetchOnMount: "always"
  });
}

export function useGrowth(range: AnalyticsRange = "30d") {
  return useQuery({
    queryKey: ["growth", range],
    queryFn: ({ signal }) => creatorService.getGrowth(range, signal),
    staleTime: 0,
    refetchOnMount: "always"
  });
}

export function useAudienceIntelligence(range: AnalyticsRange = "30d") {
  return useQuery({
    queryKey: ["audience", range],
    queryFn: ({ signal }) => creatorService.getAudienceIntelligence(range, signal),
    staleTime: 0,
    refetchOnMount: "always"
  });
}

export function useHealthScore() {
  return useQuery({
    queryKey: ["health-score"],
    queryFn: ({ signal }) => creatorService.getHealthScore(signal),
    staleTime: 0,
    refetchOnMount: "always"
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: ({ signal }) => creatorService.getSettings(signal),
    staleTime: 0,
    refetchOnMount: "always"
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: ({ signal }) => creatorService.getNotifications(signal),
    refetchInterval: 60_000,
    staleTime: 0,
    refetchOnMount: "always"
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
  return {
    markRead: useMutation({ mutationFn: creatorService.markNotificationRead, onSuccess: refresh }),
    markAllRead: useMutation({ mutationFn: creatorService.markAllNotificationsRead, onSuccess: refresh })
  };
}

export function useBenchmarkResearch() {
  return useQuery({
    queryKey: ["benchmark-research"],
    queryFn: ({ signal }) => creatorService.getBenchmarkResearch(signal),
    staleTime: 0,
    refetchOnMount: "always"
  });
}
