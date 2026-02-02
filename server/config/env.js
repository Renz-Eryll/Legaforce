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
  JWT_EXPIRES_IN,
  OPENAI_API_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  EMAIL_USER,
  EMAIL_PASSWORD,
  ARCJET_KEY,
  ARCJET_ENV,
  FRONTEND_URL,
} = process.env;
