import { config } from "../config.js";
import { authRepository } from "../repositories/index.js";
import { decrypt, encrypt, hashToken } from "../utils/security.js";

type Tokens = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  scopes?: string[];
};

type ProfileEnvelope = {
  success: boolean;
  data: {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
};

export class BlazeAuthService {
  async createAuthorization(returnTo?: string) {
    const response = await fetch(config.BLAZE_OAUTH_AUTHORIZE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        clientId: config.BLAZE_OAUTH_CLIENT_ID,
        clientSecret: config.BLAZE_OAUTH_CLIENT_SECRET,
        redirectUri: config.BLAZE_OAUTH_REDIRECT_URI,
        scopes: ["users.read", "offline.access"]
      })
    });
    if (!response.ok) throw Object.assign(new Error("Blaze authorization URL generation failed"), { status: 502 });
    const payload = await response.json() as { url: string; state: string; codeVerifier: string };
    await authRepository.createState(hashToken(payload.state), payload.codeVerifier, returnTo);
    return payload.url;
  }

  async complete(code: string, state: string) {
    const stored = await authRepository.consumeState(hashToken(state));
    if (!stored?.codeVerifier) throw Object.assign(new Error("OAuth state is invalid or expired"), { status: 400 });
    const tokens = await this.tokenRequest(config.BLAZE_OAUTH_TOKEN_URL, {
      code,
      codeVerifier: stored.codeVerifier,
      redirectUri: config.BLAZE_OAUTH_REDIRECT_URI,
      grantType: "authorization_code"
    });
    const profile = await this.getProfile(tokens.accessToken);
    const identity = await authRepository.upsertIdentity({
      userId: profile.userId,
      channelId: profile.userId,
      displayName: profile.displayName ?? profile.username,
      avatarUrl: profile.avatarUrl
    });
    await this.saveTokens(identity.channel.id, tokens);
    return { ...identity, returnTo: stored.returnTo };
  }

  async getAccessToken(channelId: string) {
    const credential = await authRepository.getCredential(channelId);
    if (!credential) throw Object.assign(new Error("Blaze channel is not connected"), { status: 401 });
    if (!credential.tokenExpiresAt || credential.tokenExpiresAt.getTime() > Date.now() + 60_000) return decrypt(credential.encryptedAccessToken);
    if (!credential.encryptedRefreshToken) throw Object.assign(new Error("Blaze session expired"), { status: 401 });
    const tokens = await this.tokenRequest(config.BLAZE_OAUTH_REFRESH_URL, {
      refreshToken: decrypt(credential.encryptedRefreshToken)
    }, false);
    await this.saveTokens(credential.channelId, tokens);
    return tokens.accessToken;
  }

  private async getProfile(accessToken: string) {
    const response = await fetch(new URL(config.BLAZE_PROFILE_PATH, config.BLAZE_API_BASE_URL), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "client-id": config.BLAZE_OAUTH_CLIENT_ID,
        Accept: "application/json"
      }
    });
    if (!response.ok) throw Object.assign(new Error("Unable to load Blaze creator profile"), { status: 502 });
    const payload = await response.json() as ProfileEnvelope;
    return payload.data;
  }

  private async tokenRequest(url: string, params: Record<string, string>, includeGrant = true) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        clientId: config.BLAZE_OAUTH_CLIENT_ID,
        clientSecret: config.BLAZE_OAUTH_CLIENT_SECRET,
        ...params,
        ...(includeGrant && !params.grantType ? { grantType: "authorization_code" } : {})
      })
    });
    if (!response.ok) throw Object.assign(new Error("Blaze token request failed"), { status: 502 });
    return response.json() as Promise<Tokens>;
  }

  private saveTokens(channelId: string, tokens: Tokens) {
    return authRepository.saveCredential(channelId, {
      accessToken: encrypt(tokens.accessToken),
      refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : undefined,
      expiresAt: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000) : undefined,
      scopes: tokens.scopes ?? []
    });
  }
}

export const blazeAuthService = new BlazeAuthService();
