/**
 * Email Transport (Nodemailer + Gmail)
 *
 * Used as the primary transport in development, and as a fallback
 * in production when SendGrid credits are exhausted.
 *
 * Initializes whenever EMAIL_USER and EMAIL_PASSWORD are available.
 */
import nodemailer from "nodemailer";
import { NODE_ENV, EMAIL_USER, EMAIL_PASSWORD } from "./env.js";

let transporter = null;

if (EMAIL_USER && EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  // Verify the connection on startup
  transporter.verify()
    .then(() => console.log(`📧 Nodemailer (Gmail) transport ready${NODE_ENV === "production" ? " (fallback)" : ""}`))
    .catch((err) => console.warn("⚠️  Nodemailer verification failed:", err.message));
} else if (NODE_ENV !== "production") {
  console.log("📧 No Gmail credentials configured — OTP will be logged to console only");
}

export default transporter;

