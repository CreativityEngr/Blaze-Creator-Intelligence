import { Router } from "express";
import { config } from "../config.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { authRepository } from "../repositories/index.js";
import { blazeAuthService } from "../services/blazeOAuth.js";
import { hashToken, parseCookies, randomToken } from "../utils/security.js";

export const authRouter = Router();

authRouter.get("/login", async (request, response) => {
  const returnTo = typeof request.query.returnTo === "string" && request.query.returnTo.startsWith("/") && !request.query.returnTo.startsWith("//")
    ? request.query.returnTo
    : undefined;
  response.redirect(await blazeAuthService.createAuthorization(returnTo));
});

authRouter.get("/callback", async (request, response) => {
  const code = String(request.query.code ?? "");
  const state = String(request.query.state ?? "");
  if (!code || !state) return response.status(400).json({ error: { message: "Missing OAuth code or state" } });
  const result = await blazeAuthService.complete(code, state);
  const sessionToken = randomToken();
  await authRepository.createSession(result.user.id, hashToken(sessionToken), new Date(Date.now() + 30 * 24 * 60 * 60_000));
  response.cookie("blaze_session", sessionToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60_000,
    path: "/"
  });
  response.redirect(new URL(result.returnTo ?? "/", config.WEB_ORIGIN).toString());
});

authRouter.post("/logout", async (request, response) => {
  const token = parseCookies(request.headers.cookie).blaze_session;
  if (token) await authRepository.deleteSession(hashToken(token));
  response.clearCookie("blaze_session", { path: "/" });
  response.status(204).end();
});

authRouter.get("/me", requireAuth, (request, response) => {
  response.json({ data: { user: request.auth!.user, channel: request.auth!.channel } });
});
