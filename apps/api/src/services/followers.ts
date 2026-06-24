import { config } from "../config.js";
import { blazeApiClient } from "./blazeClient.js";
export class BlazeFollowerService {
  async list(channelId: string) {
    const result = await blazeApiClient.get<any[] | { rows?: any[] }>(channelId, config.BLAZE_FOLLOWERS_PATH, { limit: "20" });
    return Array.isArray(result) ? result : result.rows ?? [];
  }
}
export const blazeFollowerService = new BlazeFollowerService();
