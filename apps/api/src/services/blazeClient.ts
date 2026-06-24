import { config } from "../config.js";
import { blazeAuthService } from "./blazeOAuth.js";

export class BlazeApiClient {
  async get<T>(channelId: string, path: string, query?: Record<string, string>) {
    const token = await blazeAuthService.getAccessToken(channelId);
    const url = new URL(path.replaceAll("{channelId}", encodeURIComponent(channelId)), config.BLAZE_API_BASE_URL);
    Object.entries(query ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));
    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "client-id": config.BLAZE_OAUTH_CLIENT_ID,
          Accept: "application/json"
        },
        signal: AbortSignal.timeout(config.BLAZE_API_TIMEOUT_MS)
      });
    } catch (error) {
      const status = error instanceof DOMException && error.name === "TimeoutError" ? 504 : 502;
      throw Object.assign(new Error("Blaze creator data is temporarily unavailable"), { status });
    }
    if (!response.ok) throw Object.assign(new Error(`Blaze API request failed (${response.status})`), { status: response.status === 401 ? 401 : 502 });
    const body = await response.json() as any;
    return (body.data ?? body) as T;
  }
}

export const blazeApiClient = new BlazeApiClient();
