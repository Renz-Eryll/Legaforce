import prisma from "../config/database.js";
import { createNotification, broadcastToRoles } from "../services/notification.service.js";

async function seedNotifications() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN", isActive: true }
    });

    if (admin) {
      console.log(`Seeding notifications for Admin: ${admin.email}`);
      
      await createNotification(admin.id, {
        type: "SYSTEM",
        title: "🛡️ Security System Active",
        message: "The platform's security audit system is now online and monitoring for anomalies.",
        link: "/admin/logs"
      });

      await createNotification(admin.id, {
        type: "SYSTEM",
        title: "🚀 Performance Optimization",
        message: "Database queries have been optimized for faster reporting and analytics.",
        link: "/admin/dashboard"
      });

      await createNotification(admin.id, {
        type: "MESSAGE",
        title: "📋 New Verification Request",
        message: "A new employer 'Global Tech Solutions' is awaiting verification.",
        link: "/admin/verification-queue"
      });
      
      console.log("✅ Admin notifications seeded.");
    }

    // Broadcast a welcome message to everyone
    await broadcastToRoles(["APPLICANT", "EMPLOYER", "ADMIN"], {
      type: "SYSTEM",
      title: "🌟 Welcome to the New Legaforce",
      message: "We've upgraded the notification system to be faster and more reliable. Enjoy the real-time updates!",
      link: "/"
    });

    console.log("✅ Broadcast notifications sent.");
  } catch (err) {
    console.error("Failed to seed notifications:", err);
  } finally {
    process.exit(0);
  }
}

seedNotifications();
