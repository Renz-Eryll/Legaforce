/**
 * Email Notification Service — Legaforce
 *
 * Sends transactional emails for key application lifecycle events
 * via SendGrid. Falls back to console log in dev mode.
 */
import sgMail from "../config/sendgrid.js";
import { NODE_ENV, FRONTEND_URL } from "../config/env.js";

const FROM_EMAIL = "noreply@legaforce.com";
const FROM_NAME = "Legaforce Recruitment";

async function sendEmail(to, subject, html) {
  if (NODE_ENV !== "production") {
    console.log(`📧 [DEV] Email to: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    await sgMail.send({
      to,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("SendGrid email failed:", err.response?.body || err.message);
    return false;
  }
}

// ── Application Status Change Notification ─────

const statusMessages = {
  SHORTLISTED: {
    subject: "You've been shortlisted! 🎉",
    heading: "Great news!",
    message: "Your application has been shortlisted by the employer. You may be contacted for an interview soon.",
    color: "#2563eb",
  },
  INTERVIEWED: {
    subject: "Interview completed",
    heading: "Interview recorded",
    message: "Your interview has been recorded in the system. The employer will review your performance and make a decision.",
    color: "#8b5cf6",
  },
  SELECTED: {
    subject: "You've been selected! 🎉",
    heading: "Congratulations!",
    message: "You have been selected for this position. The deployment process will begin shortly.",
    color: "#059669",
  },
  PROCESSING: {
    subject: "Deployment processing has started",
    heading: "Processing started",
    message: "Your deployment documents are now being processed. We will update you on the visa, medical, and OEC status.",
    color: "#d97706",
  },
  DEPLOYED: {
    subject: "Deployment confirmed! ✈️",
    heading: "You're deployed!",
    message: "Your deployment has been confirmed. All documents are cleared and you are ready for travel.",
    color: "#059669",
  },
  REJECTED: {
    subject: "Application update",
    heading: "Application update",
    message: "Unfortunately, your application was not successful this time. We encourage you to apply for other positions.",
    color: "#dc2626",
  },
};

export async function sendStatusChangeEmail(applicantEmail, applicantName, jobTitle, newStatus) {
  const config = statusMessages[newStatus];
  if (!config) return false;

  const appUrl = `${FRONTEND_URL || "https://legaforce.com"}/app/applications`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #111827; font-size: 20px; margin: 0;">LEGAFORCE</h1>
      <p style="color: #6b7280; font-size: 12px; margin: 4px 0 0;">Manpower Recruitment Platform</p>
    </div>
    <div style="border-left: 4px solid ${config.color}; padding-left: 16px; margin: 24px 0;">
      <h2 style="color: ${config.color}; font-size: 18px; margin: 0 0 8px;">${config.heading}</h2>
      <p style="color: #374151; font-size: 14px; margin: 0;">Hi ${applicantName},</p>
    </div>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 16px 0;">
      ${config.message}
    </p>
    <p style="color: #6b7280; font-size: 13px; margin: 16px 0;">
      <strong>Position:</strong> ${jobTitle}
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${appUrl}" style="display: inline-block; padding: 12px 24px; background: ${config.color}; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
        View Application
      </a>
    </div>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Legaforce Recruitment Platform — Empowering Filipino workers abroad
    </p>
  </div>
</body>
</html>`;

  return sendEmail(applicantEmail, config.subject, html);
}

// ── Invoice Generated Notification ─────────────

export async function sendInvoiceEmail(employerEmail, employerName, invoiceNumber, amount, currency) {
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #111827; font-size: 20px; margin: 0;">LEGAFORCE</h1>
      <p style="color: #6b7280; font-size: 12px; margin: 4px 0 0;">Manpower Recruitment Platform</p>
    </div>
    <h2 style="color: #111827; font-size: 18px;">New Invoice Generated</h2>
    <p style="color: #4b5563; font-size: 14px;">Hi ${employerName},</p>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      A new invoice <strong>${invoiceNumber}</strong> has been generated for your account.
    </p>
    <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; margin: 0;">Amount Due</p>
      <p style="color: #111827; font-size: 24px; font-weight: bold; margin: 4px 0;">${currency} ${amount.toLocaleString()}</p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${FRONTEND_URL || "https://legaforce.com"}/employer/invoices" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
        View Invoice
      </a>
    </div>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Legaforce Recruitment Platform
    </p>
  </div>
</body>
</html>`;

  return sendEmail(employerEmail, `Invoice ${invoiceNumber} Generated`, html);
}
