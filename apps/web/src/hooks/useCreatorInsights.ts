import { useQuery } from "@tanstack/react-query";
import { creatorService } from "@/services/mockCreatorService";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await creatorService.getDashboard()).data
  });
}

export function useCommunity() {
  return useQuery({
    queryKey: ["community"],
    queryFn: async () => (await creatorService.getCommunity()).data
  });
}

export function useGrowth() {
  return useQuery({
    queryKey: ["growth"],
    queryFn: async () => (await creatorService.getGrowth()).data
  });
}

export function useHealthScore() {
  return useQuery({
    queryKey: ["health-score"],
    queryFn: async () => (await creatorService.getHealthScore()).data
  });
}
