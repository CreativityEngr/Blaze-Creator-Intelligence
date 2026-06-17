export type BlazeOAuthProfile = {
  blazeId: string;
  displayName: string;
  avatarUrl: string;
};

export interface BlazeOAuthService {
  getAuthorizationUrl(state: string): string;
  exchangeCode(code: string): Promise<{ accessToken: string; refreshToken: string }>;
  getProfile(accessToken: string): Promise<BlazeOAuthProfile>;
}

export class MockBlazeOAuthService implements BlazeOAuthService {
  getAuthorizationUrl(state: string) {
    return `https://blaze.stream/oauth/authorize?state=${encodeURIComponent(state)}`;
  }

  async exchangeCode(code: string) {
    return {
      accessToken: `mock_access_${code}`,
      refreshToken: `mock_refresh_${code}`
    };
  }

  async getProfile(_accessToken: string) {
    return {
      blazeId: "blaze_aria_lane",
      displayName: "Aria Lane",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
    };
  }
}

export const blazeOAuthService = new MockBlazeOAuthService();
