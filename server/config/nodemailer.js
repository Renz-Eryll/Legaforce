import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Only verify if email credentials are configured
if (EMAIL_USER && EMAIL_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter error:", error.message);
    } else {
      console.log("✅ Email transporter ready");
    }
  });
} else {
  console.warn("⚠️  Email credentials not configured — email features disabled");
}

export default transporter;
