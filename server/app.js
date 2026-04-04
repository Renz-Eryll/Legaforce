import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import { FRONTEND_URL } from "./config/env.js";

process.env.DEBUG = "";

import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.routes.js";
import applicantRouter from "./routes/applicant.routes.js";
import employerRouter from "./routes/employer.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

app.set("trust proxy", 1); // Allow proxy IP resolution (useful for Vercel/Render)
app.use(helmet());

// Parse FRONTEND_URL as a list for multi-origin CORS (Vercel preview URLs)
const allowedOrigins = (FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, health checks)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      // Allow any Vercel preview deploy
      if (origin.endsWith(".vercel.app")) return cb(null, true);
      cb(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression({ level: 6 })); // balance speed vs compression ratio

// ── Cache control for API responses ──
app.use("/api", (req, res, next) => {
  // GET requests can be cached briefly by the browser (5s)
  if (req.method === "GET") {
    res.set("Cache-Control", "private, max-age=5, stale-while-revalidate=10");
  } else {
    res.set("Cache-Control", "no-store");
  }
  next();
});

// ── Health check & root — BEFORE rate limiter ──
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Legaforce API is running",
    version: "1.0.0",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Serve uploaded files (local dev fallback) with long cache
app.use("/uploads", express.static("uploads", { maxAge: "7d" }));

// ── Rate limiting — only on API routes ──
app.use("/api", arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/applicant", applicantRouter);
app.use("/api/v1/employer", employerRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorMiddleware);

export default app;
