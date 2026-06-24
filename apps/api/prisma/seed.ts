import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") return;
  const user = await prisma.user.upsert({
    where: { blazeUserId: "seed-user" },
    update: {},
    create: { blazeUserId: "seed-user", displayName: "Seed Creator" }
  });
  await prisma.channel.upsert({
    where: { blazeChannelId: "seed-channel" },
    update: {},
    create: { userId: user.id, blazeChannelId: "seed-channel", displayName: "Seed Channel" }
  });
}

main().finally(() => prisma.$disconnect());
