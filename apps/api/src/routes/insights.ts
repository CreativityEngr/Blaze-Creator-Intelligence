import { Router } from "express";
import {
  getCommunity,
  getDashboard,
  getGrowth,
  getHealthScore,
  getSettings,
  getBenchmarkResearch,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  getAudienceIntelligence
} from "../controllers/insightsController.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const insightsRouter = Router();
insightsRouter.use(requireAuth);

insightsRouter.get("/dashboard", getDashboard);
insightsRouter.get("/community", getCommunity);
insightsRouter.get("/growth", getGrowth);
insightsRouter.get("/audience", getAudienceIntelligence);
insightsRouter.get("/health", getHealthScore);
insightsRouter.get("/settings", getSettings);
insightsRouter.get("/research/benchmarks", getBenchmarkResearch);
insightsRouter.get("/notifications", getNotifications);
insightsRouter.post("/notifications/read-all", markAllNotificationsRead);
insightsRouter.post("/notifications/:id/read", markNotificationRead);
