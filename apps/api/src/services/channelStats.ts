import { config } from "../config.js";
import { blazeApiClient } from "./blazeClient.js";

export class BlazeChannelService {
  async getStats(channelId: string) {
    const stats = await blazeApiClient.get<any>(channelId, config.BLAZE_CHANNEL_PATH);
    return {
      followers: Number(stats.followerCount ?? stats.followers ?? stats.follower_count ?? stats.followers_count ?? 0),
      subscribers: Number(stats.subscriberCount ?? stats.subscribers ?? stats.subscriber_count ?? stats.subscribers_count ?? 0),
      viewers: Number(stats.viewerCount ?? stats.viewers ?? stats.viewer_count ?? 0)
    };
  }
}
export const blazeChannelService = new BlazeChannelService();
