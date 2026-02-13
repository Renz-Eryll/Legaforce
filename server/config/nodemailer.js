import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD, NODE_ENV } from "./env.js";

let transporter;

if (NODE_ENV === "production") {
  transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: EMAIL_PASSWORD,
    },
  });

  console.log("📧 Using SendGrid for email in production");
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  console.log("📧 Using Gmail for email in development");
}

// Verify email configuration
if (EMAIL_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter error:", error.message);
      console.error("Error Code:", error.code);
      if (error.code === "EAUTH") {
        console.error(
          "⚠️  Invalid SendGrid API key. Check your EMAIL_PASSWORD env var.",
        );
      }
    } else {
      console.log("✅ Email transporter ready");
    }
  });
} else {
  console.warn(
    "⚠️  Email credentials not configured — email features disabled",
  );
}

export default transporter;
