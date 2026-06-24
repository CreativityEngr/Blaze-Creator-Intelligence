import type { Request, Response } from "express";
import { creatorInsightsService } from "../services/creatorInsights.js";
import { benchmarkResearchService } from "../services/benchmarkResearch.js";
import { notificationService } from "../services/notifications.js";
import type { AnalyticsRange } from "@blaze/shared";

function getRange(request: Request): AnalyticsRange {
  const range = String(request.query.range ?? "30d");
  return range === "7d" || range === "all" ? range : "30d";
}

export async function getDashboard(request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getDashboard(request.auth!.channel) });
}

export async function getCommunity(request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getCommunity(request.auth!.channel) });
}

export async function getGrowth(request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getGrowth(request.auth!.channel, getRange(request)) });
}

export async function getHealthScore(request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getHealthScore(request.auth!.channel) });
}

export async function getSettings(_request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getSettings() });
}

export async function getBenchmarkResearch(_request: Request, response: Response) {
  response.json({ data: await benchmarkResearchService.summary() });
}

export async function getNotifications(request: Request, response: Response) {
  response.json({ data: await notificationService.list(request.auth!.channel.id) });
}

export async function getAudienceIntelligence(request: Request, response: Response) {
  response.json({ data: await creatorInsightsService.getAudienceIntelligence(request.auth!.channel, getRange(request)) });
}

export async function markNotificationRead(request: Request, response: Response) {
  await notificationService.markRead(request.auth!.channel.id, String(request.params.id));
  response.status(204).end();
}

export async function markAllNotificationsRead(request: Request, response: Response) {
  await notificationService.markAllRead(request.auth!.channel.id);
  response.status(204).end();
}
