import type { Channel, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      auth?: { user: User; channel: Channel; sessionToken: string };
    }
  }
}

export {};
