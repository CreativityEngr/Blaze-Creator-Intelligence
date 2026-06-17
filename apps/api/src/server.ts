import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { registerSockets } from "./sockets/index.js";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173"
  }
});

registerSockets(io);

server.listen(port, () => {
  console.log(`Blaze Creator OS API listening on http://localhost:${port}`);
});
