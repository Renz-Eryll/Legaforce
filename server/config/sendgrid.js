import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY, NODE_ENV } from "./env.js";

// Initialize SendGrid
if (SENDGRID_API_KEY && NODE_ENV === "production") {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("✅ SendGrid API initialized");
} else if (NODE_ENV !== "production") {
  console.log("📧 SendGrid disabled in development");
} else {
  console.warn("⚠️  SendGrid API key not configured");
}

export default sgMail;
