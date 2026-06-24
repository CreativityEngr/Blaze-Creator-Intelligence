import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { registerSockets } from "./sockets/index.js";
import { startSnapshotEngine } from "./jobs/syncCreatorSnapshots.js";
import { startBlazeEventSub } from "./services/events.js";
import { startBenchmarkCollector } from "./jobs/collectBenchmarks.js";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    credentials: true
  }
});

registerSockets(io);
startSnapshotEngine();
startBlazeEventSub();
startBenchmarkCollector();

server.listen(port, () => {
  console.log(`Blaze Creator Intelligence API listening on http://localhost:${port}`);
});
