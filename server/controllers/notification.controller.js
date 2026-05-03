import prisma from "../config/database.js";
import { markAllNotificationsAsRead, deleteOldNotifications, getNotificationStats } from "../services/notification.service.js";

export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, unreadOnly } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user.id,
    };

    if (type) where.type = type;
    if (unreadOnly === "true") where.read = false;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await markAllNotificationsAsRead(req.user.id);
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await getNotificationStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
