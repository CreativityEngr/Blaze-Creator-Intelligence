import { Router } from "express";
import { getCommunity, getDashboard, getGrowth, getHealthScore } from "../controllers/insightsController.js";

export const insightsRouter = Router();

insightsRouter.get("/dashboard", getDashboard);
insightsRouter.get("/community", getCommunity);
insightsRouter.get("/growth", getGrowth);
insightsRouter.get("/health", getHealthScore);
