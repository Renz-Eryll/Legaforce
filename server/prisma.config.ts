import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Only load local env file in non-production (it won't exist on Render)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development.local" });
} else {
  dotenv.config(); // loads from process.env (already set by Render)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
