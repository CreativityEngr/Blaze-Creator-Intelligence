import type { Server } from "socket.io";
import { mockStream } from "../utils/mockData.js";

export interface EventsService {
  register(io: Server): void;
}

export class MockEventsService implements EventsService {
  register(io: Server) {
    io.on("connection", (socket) => {
      socket.emit("live:status", mockStream);
    });
  }
}

export const eventsService = new MockEventsService();
