import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { NODE_ENV } from "./env.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log(`✅ Connected to PostgreSQL database in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
};

export default prisma;
