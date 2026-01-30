import "dotenv/config";
import { defineConfig } from "prisma/config";

// Load development environment
import dotenv from "dotenv";
dotenv.config({ path: ".env.development.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
