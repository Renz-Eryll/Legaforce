import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  getStats
} from "../controllers/notification.controller.js";

const router = Router();

router.use(authorize);

router.get("/", getNotifications);
router.get("/stats", getStats);
router.patch("/mark-all-read", markAllRead);
router.patch("/:id/read", markRead);
router.delete("/:id", deleteNotification);

export default router;
