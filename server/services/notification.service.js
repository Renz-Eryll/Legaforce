import prisma from "../config/database.js";
import { sendToUser } from "./sse.service.js";

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId,
  { type, title, message, link, relatedId, metadata },
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        relatedId,
        metadata,
        read: false,
      },
    });

    // Send real-time SSE notification
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

    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err);
    throw err;
  }
}

/**
 * Notify user of application status change
 */
export async function notifyApplicationStatusChange(
  userId,
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

  return createNotification(userId, {
    type: config.type,
    title: config.title,
    message: config.message,
    relatedId: applicationId,
    link: `/applicant/applications/${applicationId}`,
    metadata: { jobTitle, companyName, status },
  });
}

/**
 * Notify user of job recommendation
 */
export async function notifyJobRecommendation(
  userId,
  { jobTitle, companyName, matchScore, jobId },
) {
  return createNotification(userId, {
    type: "JOB_RECOMMENDATION",
    title: `📧 New Job Match: ${jobTitle}`,
    message: `We found a job that matches your skills (${matchScore}% match) at ${companyName}. Apply now!`,
    relatedId: jobId,
    link: `/applicant/jobs/${jobId}`,
    metadata: { jobTitle, companyName, matchScore },
  });
}

/**
 * Notify user of offer
 */
export async function notifyJobOffer(
  userId,
  { jobTitle, companyName, jobId },
) {
  return createNotification(userId, {
    type: "OFFER",
    title: `🎯 Job Offer: ${jobTitle}`,
    message: `You have received an offer from ${companyName} for the position of ${jobTitle}.`,
    relatedId: jobId,
    link: `/applicant/jobs/${jobId}`,
    metadata: { jobTitle, companyName },
  });
}

/**
 * Broadcast notification to all users with specific roles
 */
export async function broadcastToRoles(
  roles,
  { type, title, message, link, metadata }
) {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: roles }, isActive: true },
      select: { id: true }
    });

    const notifications = await Promise.all(
      users.map(user => createNotification(user.id, { type, title, message, link, metadata }))
    );

    return notifications;
  } catch (err) {
    console.error("Failed to broadcast notifications:", err);
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

/**
 * Delete old notifications (older than specified days)
 */
export async function deleteOldNotifications(userId, daysOld = 30) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return prisma.notification.deleteMany({
    where: {
      userId,
      createdAt: { lt: cutoffDate },
      read: true,
    },
  });
}

/**
 * Get notification stats for a user
 */
export async function getNotificationStats(userId) {
  const [total, unread, byType] = await Promise.all([
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.notification.groupBy({
      by: ["type"],
      where: { userId },
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
