import { PrismaClient } from "./prismaClient/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "./src/config/env.config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: config.get("dbUrl"),
});

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;