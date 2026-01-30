import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

export default transporter;
