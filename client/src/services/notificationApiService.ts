import api from "./api";

export const notificationApiService = {
  async getNotifications(params?: { page?: number; limit?: number; type?: string; unreadOnly?: boolean }) {
    try {
      const { data } = await api.get("/notifications", { params });
      return data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  async getStats() {
    try {
      const { data } = await api.get("/notifications/stats");
      return data;
    } catch (error) {
      console.error("Failed to fetch notification stats:", error);
      throw error;
    }
  },

  async markRead(id: string) {
    try {
      const { data } = await api.patch(`/notifications/${id}/read`);
      return data;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  async markAllRead() {
    try {
      const { data } = await api.patch("/notifications/mark-all-read");
      return data;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  async deleteNotification(id: string) {
    try {
      const { data } = await api.delete(`/notifications/${id}`);
      return data;
    } catch (error) {
      console.error("Failed to delete notification:", error);
      throw error;
    }
  },
};
