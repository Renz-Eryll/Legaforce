import prisma from "../config/database.js";
import { createNotification, broadcastToRoles } from "../services/notification.service.js";

/**
 * Check for SLA breaches and notify admins
 * This can be called by a cron job or a manual trigger
 */
export async function checkAndNotifySlaBreaches() {
  try {
    const now = new Date();
    const thresholds = {
      APPLIED: 3,
      SHORTLISTED: 5,
      INTERVIEWED: 7,
      SELECTED: 14,
      PROCESSING: 21
    };

    const activeApps = await prisma.application.findMany({
      where: {
        status: { in: Object.keys(thresholds) }
      },
      include: {
        applicant: { select: { firstName: true, lastName: true } },
        jobOrder: { select: { title: true, employer: { select: { companyName: true } } } }
      }
    });

    let breachCount = 0;

    for (const app of activeApps) {
      const thresholdDays = thresholds[app.status];
      const updatedAt = new Date(app.updatedAt);
      const diffDays = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays >= thresholdDays) {
        // Check if we already notified for this breach in the last 24h to avoid spam
        // For simplicity in this dev version, we'll just create it if it doesn't exist for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const existingNotif = await prisma.notification.findFirst({
          where: {
            type: "SYSTEM",
            relatedId: app.id,
            createdAt: { gte: startOfDay }
          }
        });

        if (!existingNotif) {
          const severity = diffDays >= thresholdDays * 2 ? "🔴 CRITICAL" : "⚠️ WARNING";
          await broadcastToRoles(["ADMIN"], {
            type: "SYSTEM",
            title: `${severity}: SLA Breach`,
            message: `Application for ${app.applicant.firstName} ${app.applicant.lastName} has been in ${app.status} status for ${diffDays} days (Threshold: ${thresholdDays} days).`,
            link: `/admin/applications/${app.id}`,
            relatedId: app.id,
            metadata: { severity, daysInStatus: diffDays, status: app.status }
          });
          breachCount++;
        }
      }
    }

    return { success: true, breachCount };
  } catch (err) {
    console.error("SLA Breach check failed:", err);
    return { success: false, error: err.message };
  }
}
