export type NotificationType = "TripStarted" | "ExpensePrompt";

export interface Notification {
  notificationId: number;
  userId: number;
  tripId: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}