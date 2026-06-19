import { Notification } from "@/src/models/Notification";
import { tripNotificationService } from "@/src/services/tripNotificationService";
import { useState } from "react";

export function useNotificationController(userId: number) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripNotificationService.getNotifications(userId);
      setNotifications(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripNotificationService.getUnreadNotifications(userId);
      setUnreadCount(data.length);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await tripNotificationService.markAsRead(
        userId,
        notificationId,
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? updated : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await tripNotificationService.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (
    notificationId: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await tripNotificationService.deleteNotification(userId, notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.notificationId !== notificationId),
      );
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}