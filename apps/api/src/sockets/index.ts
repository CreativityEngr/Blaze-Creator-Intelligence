import type { Server } from "socket.io";
import { authRepository } from "../repositories/index.js";
import { setSocketServer } from "../services/events.js";
import { hashToken, parseCookies } from "../utils/security.js";

export function registerSockets(io: Server) {
  setSocketServer(io);
  io.use(async (socket, next) => {
    try {
      const token = parseCookies(socket.handshake.headers.cookie).blaze_session;
      if (!token) return next(new Error("Authentication required"));
      const session = await authRepository.findSession(hashToken(token));
      if (!session || session.expiresAt <= new Date()) return next(new Error("Session expired"));
      socket.data.channelId = session.user.channels[0]?.id;
      next();
    } catch (error) {
      console.error("Socket authentication unavailable", error);
      next(new Error("Realtime service temporarily unavailable"));
    }
  });
  io.on("connection", (socket) => {
    if (socket.data.channelId) void socket.join(`channel:${socket.data.channelId}`);
  });
}
