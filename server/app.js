import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config/env.js";

process.env.DEBUG = "";

import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.routes.js";
import applicantRouter from "./routes/applicant.routes.js";
import employerRouter from "./routes/employer.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/applicant", applicantRouter);
app.use("/api/v1/employer", employerRouter);

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

app.use(errorMiddleware);

export default app;
