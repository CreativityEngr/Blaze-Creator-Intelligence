CREATE TYPE "NotificationKind" AS ENUM ('EVENT', 'INSIGHT', 'TREND', 'SYSTEM');

CREATE TABLE "benchmark_runs" (
    "id" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "creatorCount" INTEGER NOT NULL,
    "distinctCreatorCount" INTEGER NOT NULL,
    "liveCreatorCount" INTEGER NOT NULL,
    "volatility" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "benchmark_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "benchmark_channel_snapshots" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "blazeChannelId" TEXT NOT NULL,
    "category" TEXT,
    "isLive" BOOLEAN NOT NULL,
    "followerCount" INTEGER NOT NULL,
    "subscriberCount" INTEGER NOT NULL,
    "viewerCount" INTEGER NOT NULL,
    "vodCount" INTEGER NOT NULL,
    "viewerFollowerRate" DOUBLE PRECISION,
    "subscriberFollowerRate" DOUBLE PRECISION,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "benchmark_channel_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "benchmark_percentiles" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "p10" DOUBLE PRECISION,
    "p25" DOUBLE PRECISION,
    "p50" DOUBLE PRECISION,
    "p75" DOUBLE PRECISION,
    "p90" DOUBLE PRECISION,
    "mean" DOUBLE PRECISION,
    "stdDev" DOUBLE PRECISION,
    CONSTRAINT "benchmark_percentiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "kind" "NotificationKind" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "metadata" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "benchmark_runs_cohort_capturedAt_idx" ON "benchmark_runs"("cohort", "capturedAt");
CREATE UNIQUE INDEX "benchmark_channel_snapshots_runId_blazeChannelId_key" ON "benchmark_channel_snapshots"("runId", "blazeChannelId");
CREATE INDEX "benchmark_channel_snapshots_blazeChannelId_capturedAt_idx" ON "benchmark_channel_snapshots"("blazeChannelId", "capturedAt");
CREATE UNIQUE INDEX "benchmark_percentiles_runId_metric_key" ON "benchmark_percentiles"("runId", "metric");
CREATE INDEX "benchmark_percentiles_metric_idx" ON "benchmark_percentiles"("metric");
CREATE INDEX "notifications_channelId_readAt_createdAt_idx" ON "notifications"("channelId", "readAt", "createdAt");

ALTER TABLE "benchmark_channel_snapshots"
ADD CONSTRAINT "benchmark_channel_snapshots_runId_fkey"
FOREIGN KEY ("runId") REFERENCES "benchmark_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "benchmark_percentiles"
ADD CONSTRAINT "benchmark_percentiles_runId_fkey"
FOREIGN KEY ("runId") REFERENCES "benchmark_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_channelId_fkey"
FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
