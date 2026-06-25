import type { NextFunction, Request, Response } from "express";
import { authRepository } from "../repositories/index.js";
import { hashToken, parseCookies } from "../utils/security.js";

type AuthSession = NonNullable<Awaited<ReturnType<typeof authRepository.findSession>>>;
const sessionCache = new Map<string, { session: AuthSession; expiresAt: number }>();
const cacheTtlMs = 60_000;

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = parseCookies(request.headers.cookie).blaze_session;
  if (!token) return response.status(401).json({ error: { message: "Authentication required" } });
  const tokenHash = hashToken(token);
  const cached = sessionCache.get(tokenHash);
  const session = cached && cached.expiresAt > Date.now()
    ? cached.session
    : await authRepository.findSession(tokenHash);
  if (!session || session.expiresAt <= new Date() || session.user.channels.length === 0) {
    sessionCache.delete(tokenHash);
    return response.status(401).json({ error: { message: "Session is invalid or expired" } });
  }
  sessionCache.set(tokenHash, { session, expiresAt: Date.now() + cacheTtlMs });
  request.auth = { user: session.user, channel: session.user.channels[0], sessionToken: token };
  next();
}
