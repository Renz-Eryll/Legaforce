import sgMail from "@sendgrid/mail";
import { EMAIL_PASSWORD, NODE_ENV } from "./env.js";

// Initialize SendGrid
if (EMAIL_PASSWORD && NODE_ENV === "production") {
  sgMail.setApiKey(EMAIL_PASSWORD);
  console.log(" SendGrid API initialized");
} else if (NODE_ENV !== "production") {
  console.log("📧 SendGrid disabled in development");
} else {
  console.warn("⚠️  SendGrid API key not configured");
}

export default sgMail;
