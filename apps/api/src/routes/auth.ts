import { Router } from "express";
import { blazeOAuthService } from "../services/blazeOAuth.js";

export const authRouter = Router();

authRouter.get("/login", (_request, response) => {
  response.json({
    data: {
      url: blazeOAuthService.getAuthorizationUrl("mock_state")
    }
  });
});

authRouter.get("/callback", async (request, response) => {
  const code = String(request.query.code ?? "demo");
  const tokens = await blazeOAuthService.exchangeCode(code);
  const profile = await blazeOAuthService.getProfile(tokens.accessToken);

  response.json({
    data: {
      profile,
      tokens
    }
  });
});
