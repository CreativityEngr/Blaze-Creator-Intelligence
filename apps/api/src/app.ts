import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";
import { insightsRouter } from "./routes/insights.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.WEB_ORIGIN ?? "http://localhost:5173"
    })
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/healthz", (_request, response) => {
    response.json({ data: { ok: true } });
  });

  app.use("/api/auth", authRouter);
  app.use("/api", insightsRouter);
  app.use(errorHandler);

  return app;
}
