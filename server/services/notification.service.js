import prisma from "../config/database.js";
import { sendToUser } from "./sse.service.js";

/**
 * Create a notification for an applicant
 */
export async function createNotification(
  profileId,
  { type, title, message, link, relatedId, metadata },
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        profileId,
        type,
        title,
        message,
        link,
        relatedId,
        metadata,
        read: false,
      },
      include: {
        profile: { select: { userId: true } },
      },
    });

    // Send real-time SSE notification
    // Note: SSE clients are keyed by userId, NOT profileId
    const userId = notification.profile?.userId;
    if (userId) {
      sendToUser(userId, "notification", {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        date: notification.createdAt.toISOString(),
        read: false,
        link: notification.link,
        relatedId: notification.relatedId,
        metadata: notification.metadata,
      });
    }

    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err);
    throw err;
  }
}

/**
 * Notify applicant of application status change
 */
export async function notifyApplicationStatusChange(
  profileId,
  { status, jobTitle, companyName, applicationId },
) {
  const statusMessages = {
    SHORTLISTED: {
      title: "🎉 Application Shortlisted!",
      message: `Your application for "${jobTitle}" at ${companyName} has been shortlisted. Great news!`,
      type: "APPLICATION_STATUS",
    },
    INTERVIEWED: {
      title: "📹 Interview Scheduled",
      message: `You've been scheduled for an interview for "${jobTitle}" at ${companyName}. Check your email for details.`,
      type: "APPLICATION_STATUS",
    },
    SELECTED: {
      title: "✨ Congratulations! You've Been Selected",
      message: `You've been selected for "${jobTitle}" at ${companyName}. Deployment process will begin shortly.`,
      type: "APPLICATION_STATUS",
    },
    PROCESSING: {
      title: "⏳ Processing Your Deployment",
      message: `Your deployment for "${jobTitle}" at ${companyName} is being processed. We'll notify you of any updates.`,
      type: "APPLICATION_STATUS",
    },
    DEPLOYED: {
      title: "🚀 Successfully Deployed!",
      message: `You have been successfully deployed to "${jobTitle}" at ${companyName}. Welcome to your new role!`,
      type: "DEPLOYMENT",
    },
    REJECTED: {
      title: "📋 Application Update",
      message: `Your application for "${jobTitle}" at ${companyName} was not selected this time. Keep trying!`,
      type: "APPLICATION_STATUS",
    },
  };

  const config = statusMessages[status];
  if (!config) return null;

  return createNotification(profileId, {
    type: config.type,
    title: config.title,
    message: config.message,
    relatedId: applicationId,
    link: `/applicant/applications/${applicationId}`,
    metadata: { jobTitle, companyName, status },
  });
}

/**
 * Notify applicant of job recommendation
 */
export async function notifyJobRecommendation(
  profileId,
  { jobTitle, companyName, matchScore, jobId },
) {
  return createNotification(profileId, {
    type: "JOB_RECOMMENDATION",
    title: `📧 New Job Match: ${jobTitle}`,
    message: `We found a job that matches your skills (${matchScore}% match) at ${companyName}. Apply now!`,
    relatedId: jobId,
    link: `/applicant/jobs/${jobId}`,
    metadata: { jobTitle, companyName, matchScore },
  });
}

/**
 * Notify applicant of offer
 */
export async function notifyJobOffer(
  profileId,
  { jobTitle, companyName, jobId },
) {
  return createNotification(profileId, {
    type: "OFFER",
    title: `🎯 Job Offer: ${jobTitle}`,
    message: `You have received an offer from ${companyName} for the position of ${jobTitle}.`,
    relatedId: jobId,
    link: `/applicant/jobs/${jobId}`,
    metadata: { jobTitle, companyName },
  });
}

/**
 * Mark all notifications as read for a profile
 */
export async function markAllNotificationsAsRead(profileId) {
  return prisma.notification.updateMany({
    where: { profileId, read: false },
    data: { read: true },
  });
}

/**
 * Delete old notifications (older than specified days)
 */
export async function deleteOldNotifications(profileId, daysOld = 30) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return prisma.notification.deleteMany({
    where: {
      profileId,
      createdAt: { lt: cutoffDate },
      read: true,
    },
  });
}

/**
 * Get notification stats for a profile
 */
export async function getNotificationStats(profileId) {
  const [total, unread, byType] = await Promise.all([
    prisma.notification.count({ where: { profileId } }),
    prisma.notification.count({ where: { profileId, read: false } }),
    prisma.notification.groupBy({
      by: ["type"],
      where: { profileId },
      _count: { type: true },
      orderBy: { _count: { type: "desc" } },
    }),
  ]);

  return {
    total,
    unread,
    byType: byType.map((item) => ({
      type: item.type,
      count: item._count.type,
    })),
  };
}
