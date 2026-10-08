import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
}

export const {
  PORT = 5000,
  NODE_ENV = "development",
  SERVER_URL,
  DATABASE_URL,
  JWT_SECRET,
  // Without a default, jwt.sign() issues tokens that never expire
  JWT_EXPIRES_IN = "7d",
  GEMINI_API_KEY,
  OPENAI_API_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  ARCJET_KEY,
  ARCJET_ENV,
  FRONTEND_URL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = process.env;

const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET"];

// Fail fast on startup instead of erroring on the first login/request
export const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
