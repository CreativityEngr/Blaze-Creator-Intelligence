import type { Server } from "socket.io";
import { eventsService } from "../services/events.js";

export function registerSockets(io: Server) {
  eventsService.register(io);
}
