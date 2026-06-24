import type { NextFunction, Request, Response } from "express";
import { authRepository } from "../repositories/index.js";
import { hashToken, parseCookies } from "../utils/security.js";

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = parseCookies(request.headers.cookie).blaze_session;
  if (!token) return response.status(401).json({ error: { message: "Authentication required" } });
  const session = await authRepository.findSession(hashToken(token));
  if (!session || session.expiresAt <= new Date() || session.user.channels.length === 0) {
    return response.status(401).json({ error: { message: "Session is invalid or expired" } });
  }
  request.auth = { user: session.user, channel: session.user.channels[0], sessionToken: token };
  next();
}
