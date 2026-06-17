import type { Request, Response } from "express";
import { creatorInsightsService } from "../services/creatorInsights.js";

export async function getDashboard(_request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getDashboard() });
}

export async function getCommunity(_request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getCommunity() });
}

export async function getGrowth(_request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getGrowth() });
}

export async function getHealthScore(_request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getHealthScore() });
}
