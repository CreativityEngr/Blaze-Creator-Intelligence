import { getHealthScoreStatus, type HealthScoreStatus } from "@blaze/shared";

type HealthScorePresentation = {
  status: HealthScoreStatus;
  color: string;
  glow: string;
};

const presentations: Record<HealthScoreStatus, Omit<HealthScorePresentation, "status">> = {
  "Needs Attention": {
    color: "#ff625f",
    glow: "rgba(255, 98, 95, 0.34)"
  },
  Healthy: {
    color: "#f2a23a",
    glow: "rgba(242, 162, 58, 0.32)"
  },
  Strong: {
    color: "#f6d44a",
    glow: "rgba(246, 212, 74, 0.32)"
  },
  Elite: {
    color: "#53d6a0",
    glow: "rgba(83, 214, 160, 0.34)"
  }
};

export function getHealthScorePresentation(score: number): HealthScorePresentation {
  const status = getHealthScoreStatus(score);

  return {
    status,
    ...presentations[status]
  };
}
