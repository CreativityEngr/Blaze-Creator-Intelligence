import { config } from "../config.js";
import { blazeApiClient } from "./blazeClient.js";
export class BlazeSubscriberService {
  async list(channelId: string) {
    const result = await blazeApiClient.get<any[] | { rows?: any[] }>(channelId, config.BLAZE_SUBSCRIBERS_PATH, { limit: "20" });
    return Array.isArray(result) ? result : result.rows ?? [];
  }
}
export const blazeSubscriberService = new BlazeSubscriberService();
