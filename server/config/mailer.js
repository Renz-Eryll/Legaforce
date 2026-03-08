/**
 * Development Email Transport (Nodemailer + Gmail)
 *
 * Used in development/local mode to actually send OTP and notification
 * emails so the full registration flow can be tested end-to-end.
 *
 * In production, emails go through SendGrid instead (see sendgrid.js).
 */
import nodemailer from "nodemailer";
import { NODE_ENV, EMAIL_USER, EMAIL_PASSWORD } from "./env.js";

let transporter = null;

if (NODE_ENV !== "production" && EMAIL_USER && EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  // Verify the connection on startup
  transporter.verify()
    .then(() => console.log("📧 Nodemailer (Gmail) transport ready for development"))
    .catch((err) => console.warn("⚠️  Nodemailer verification failed:", err.message));
} else if (NODE_ENV !== "production") {
  console.log("📧 No Gmail credentials configured — OTP will be logged to console only");
}

export default transporter;
