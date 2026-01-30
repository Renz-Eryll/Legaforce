import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
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
