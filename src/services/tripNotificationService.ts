import { Notification } from "@/src/models/Notification";

const BASE_URL = "http://10.120.67.97:3000/api";

export const tripNotificationService = {
  getNotifications: async (userId: number): Promise<Notification[]> => {
    const res = await fetch(`${BASE_URL}/users/${userId}/notifications`);
    if (!res.ok) {
      throw new Error("Failed to fetch notifications");
    }
    return res.json();
  },

  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    const res = await fetch(
      `${BASE_URL}/users/${userId}/notifications/unread`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch unread notifications");
    }
    return res.json();
  },

  markAsRead: async (
    userId: number,
    notificationId: number,
  ): Promise<Notification> => {
    const res = await fetch(
      `${BASE_URL}/users/${userId}/notifications/${notificationId}/read`,
      { method: "PATCH" },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to mark notification as read");
    }
    return data.notification;
  },

  markAllAsRead: async (userId: number): Promise<Notification[]> => {
    const res = await fetch(
      `${BASE_URL}/users/${userId}/notifications/read-all`,
      { method: "PATCH" },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to mark all notifications as read");
    }
    return data.notifications;
  },

  deleteNotification: async (
    userId: number,
    notificationId: number,
  ): Promise<void> => {
    const res = await fetch(
      `${BASE_URL}/users/${userId}/notifications/${notificationId}`,
      { method: "DELETE" },
    );
    if (!res.ok) {
      throw new Error("Failed to delete notification");
    }
  },
};