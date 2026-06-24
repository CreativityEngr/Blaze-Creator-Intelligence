import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  SESSION_SECRET: z.string().min(32),
  TOKEN_ENCRYPTION_KEY: z.string().min(32),
  BLAZE_OAUTH_CLIENT_ID: z.string().min(1),
  BLAZE_OAUTH_CLIENT_SECRET: z.string().min(1),
  BLAZE_OAUTH_REDIRECT_URI: z.string().url(),
  BLAZE_OAUTH_AUTHORIZE_URL: z.string().url(),
  BLAZE_OAUTH_TOKEN_URL: z.string().url(),
  BLAZE_OAUTH_REFRESH_URL: z.string().url(),
  BLAZE_API_BASE_URL: z.string().url(),
  BLAZE_EVENTS_URL: z.string().url().default("https://blaze.stream"),
  BLAZE_EVENTS_PATH: z.string().default("/ws"),
  BLAZE_PROFILE_PATH: z.string().default("/me"),
  BLAZE_CHANNEL_PATH: z.string().default("/channels/{channelId}"),
  BLAZE_STREAM_PATH: z.string().default("/channels/{channelId}/stream"),
  BLAZE_LIVE_PATH: z.string().default("/channels/{channelId}/live"),
  BLAZE_FOLLOWERS_PATH: z.string().default("/channels/{channelId}/followers"),
  BLAZE_SUBSCRIBERS_PATH: z.string().default("/channels/{channelId}/subscribers"),
  BLAZE_ACTIVITIES_PATH: z.string().default("/channels/{channelId}/activities"),
  BLAZE_API_TIMEOUT_MS: z.coerce.number().int().positive().default(8_000),
  SNAPSHOT_INTERVAL_MINUTES: z.coerce.number().int().positive().default(5),
  BENCHMARK_INTERVAL_MINUTES: z.coerce.number().int().positive().default(240),
  BENCHMARK_MAX_CHANNELS: z.coerce.number().int().positive().max(200).default(100)
});

export const config = schema.parse(process.env);
