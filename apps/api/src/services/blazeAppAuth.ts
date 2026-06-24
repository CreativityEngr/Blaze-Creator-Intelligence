import { config } from "../config.js";

let cached: { token: string; expiresAt: number } | undefined;

export class BlazeAppAuthService {
  async getAccessToken() {
    if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
    const response = await fetch(config.BLAZE_OAUTH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        clientId: config.BLAZE_OAUTH_CLIENT_ID,
        clientSecret: config.BLAZE_OAUTH_CLIENT_SECRET,
        grantType: "client_credentials"
      })
    });
    if (!response.ok) throw new Error(`Blaze app token request failed (${response.status})`);
    const payload = await response.json() as { accessToken: string; expiresIn?: number };
    cached = {
      token: payload.accessToken,
      expiresAt: Date.now() + (payload.expiresIn ?? 3600) * 1000
    };
    return cached.token;
  }
}

export const blazeAppAuthService = new BlazeAppAuthService();
