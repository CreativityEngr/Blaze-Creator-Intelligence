import type { Server } from "socket.io";
import { io as createSocket, type Socket } from "socket.io-client";
import { config } from "../config.js";
import { syncCreatorChannel } from "../jobs/syncCreatorSnapshots.js";
import { channelRepository, notificationRepository } from "../repositories/index.js";
import { blazeAuthService } from "./blazeOAuth.js";

let socketServer: Server | undefined;
let blazeSocket: Socket | undefined;
let activeBlazeSessionId: string | undefined;

const subscriptionTypes = [
  "stream.online",
  "stream.offline",
  "channel.follow",
  "channel.subscribe"
] as const;

type EventSubMessage = {
  metadata?: {
    messageType?: string;
    subscriptionType?: string;
  };
  payload?: Record<string, any>;
};

export function setSocketServer(io: Server) {
  socketServer = io;
}

export class BlazeEventsService {
  start() {
    if (blazeSocket) return;
    blazeSocket = createSocket(config.BLAZE_EVENTS_URL, {
      path: config.BLAZE_EVENTS_PATH,
      transports: ["websocket"]
    });
    blazeSocket.on("eventsub", (message: EventSubMessage) => {
      void this.handleMessage(message).catch((error) => {
        console.error("Blaze EventSub message failed", error);
      });
    });
    blazeSocket.on("connect_error", (error) => {
      console.error("Blaze EventSub connection failed", error.message);
    });
    blazeSocket.on("disconnect", () => {
      activeBlazeSessionId = undefined;
    });
  }

  private async handleMessage(message: EventSubMessage) {
    if (message.metadata?.messageType === "session_welcome") {
      const sessionId = String(message.payload?.sessionId ?? "");
      if (sessionId) {
        activeBlazeSessionId = sessionId;
        void this.subscribeWithRetry(sessionId);
      }
      return;
    }
    if (message.metadata?.messageType !== "notification" || !message.metadata.subscriptionType || !message.payload) return;
    await this.processWithRetry(message.metadata.subscriptionType, message.payload);
  }

  private async processWithRetry(type: string, event: Record<string, any>, attempt = 1): Promise<void> {
    try {
      await this.process(type, event);
    } catch (error) {
      if (attempt >= 5) throw error;
      console.error(`Blaze EventSub delivery attempt ${attempt} failed`, error);
      setTimeout(() => void this.processWithRetry(type, event, attempt + 1), attempt * 2_000);
    }
  }

  private async subscribeWithRetry(sessionId: string, attempt = 1): Promise<void> {
    if (sessionId !== activeBlazeSessionId) return;
    try {
      await this.subscribeChannels(sessionId);
    } catch (error) {
      if (sessionId !== activeBlazeSessionId) return;
      console.error(`Blaze EventSub setup attempt ${attempt} failed`, error);
      setTimeout(() => void this.subscribeWithRetry(sessionId, attempt + 1), Math.min(30_000, attempt * 5_000));
    }
  }

  private async subscribeChannels(sessionId: string) {
    const channels = await channelRepository.listAll();
    for (const channel of channels) {
      if (!channel.credential) continue;
      const token = await blazeAuthService.getAccessToken(channel.blazeChannelId);
      for (const type of subscriptionTypes) {
        const response = await fetch(new URL("/v1/events/subscriptions", config.BLAZE_API_BASE_URL), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "client-id": config.BLAZE_OAUTH_CLIENT_ID,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            type,
            version: "1",
            sessionId,
            condition: { channelId: channel.blazeChannelId }
          })
        });
        const result = await response.json().catch(() => undefined) as { success?: boolean; message?: string } | undefined;
        if (!response.ok || result?.success === false) {
          console.error(`Blaze EventSub subscription failed for ${type} (${response.status}: ${result?.message ?? "unknown error"})`);
        }
      }
      const verification = await fetch(
        new URL(`/v1/events/${encodeURIComponent(sessionId)}/subscriptions`, config.BLAZE_API_BASE_URL),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "client-id": config.BLAZE_OAUTH_CLIENT_ID,
            Accept: "application/json"
          }
        }
      );
      const body = verification.ok
        ? await verification.json() as { data?: unknown[] | { rows?: unknown[]; subscriptions?: unknown[] } }
        : undefined;
      const subscriptions = Array.isArray(body?.data)
        ? body.data
        : body?.data?.subscriptions ?? body?.data?.rows ?? [];
      console.log(`Blaze EventSub ready for channel ${channel.id} (${subscriptions.length} active subscriptions)`);
    }
  }

  async process(type: string, event: any) {
    console.log(`Blaze EventSub notification received: ${type}`);
    const channel = await channelRepository.getByBlazeId(String(event.channelId ?? ""));
    if (!channel) return;
    const typeMap: Record<string, any> = {
      "channel.follow": "FOLLOW",
      "channel.subscribe": "SUBSCRIBE",
      "stream.online": "STREAM_STARTED",
      "stream.offline": "STREAM_ENDED"
    };
    const actor = event.follower ?? event.subscriber;
    const occurredAt = new Date(actor?.followedAt ?? actor?.subscribedAt ?? event.streamStartedAt ?? event.streamEndedAt ?? Date.now());
    const eventId = event.id
      ?? event.messageId
      ?? event.liveStreamId
      ?? `${type}:${actor?.id ?? channel.blazeChannelId}:${occurredAt.toISOString()}`;
    await channelRepository.upsertActivity(channel.id, {
      id: eventId,
      type: typeMap[type] ?? "OTHER",
      actorId: actor?.id,
      actorName: actor?.displayName ?? actor?.username,
      label: type,
      occurredAt,
      payload: event
    });
    await notificationRepository.create(channel.id, {
      kind: "EVENT",
      title: type === "channel.follow"
        ? `${actor?.displayName ?? actor?.username ?? "A creator"} followed your channel`
        : type === "channel.subscribe"
          ? `${actor?.displayName ?? actor?.username ?? "A creator"} subscribed`
          : type === "stream.online"
            ? "Your stream is live"
            : "Your stream ended",
      body: type,
      metadata: { type, actorId: actor?.id }
    });
    console.log(`Blaze EventSub notification persisted: ${type}`);
    socketServer?.to(`channel:${channel.id}`).emit(type, event);
    socketServer?.to(`channel:${channel.id}`).emit("creator:data-changed", { type });
    console.log(`Blaze EventSub notification broadcast: ${type}`);
    void this.refreshCreatorData(channel);
  }

  private async refreshCreatorData(channel: { id: string; blazeChannelId: string }, attempt = 1): Promise<void> {
    try {
      await syncCreatorChannel(channel);
      socketServer?.to(`channel:${channel.id}`).emit("creator:data-changed", { type: "data.refresh" });
      console.log(`Blaze creator data refreshed after event for channel ${channel.id}`);
    } catch (error) {
      if (attempt >= 5) {
        console.error("Post-event creator refresh failed", error);
        return;
      }
      setTimeout(() => void this.refreshCreatorData(channel, attempt + 1), attempt * 5_000);
    }
  }
}

export const blazeEventsService = new BlazeEventsService();

export function startBlazeEventSub() {
  blazeEventsService.start();
}
