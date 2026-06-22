import { Colors } from "@/constants/theme";
import { useNotificationController } from "@/src/controllers/tripNotificationController";
import { Notification } from "@/src/models/Notification";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// TODO: replace with logged-in user id once auth is wired
const CURRENT_USER_ID = 1;

const TYPE_ICON: Record<Notification["type"], keyof typeof Ionicons.glyphMap> = {
  TripStarted: "navigate-outline",
  ExpensePrompt: "receipt-outline",
};

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function NotificationsScreen() {
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationController(CURRENT_USER_ID);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "700",
            color: Colors.textPrimary,
          }}
        >
          Notifications
        </Text>
        <TouchableOpacity
          onPress={markAllAsRead}
          disabled={!hasUnread}
          style={{ padding: 4, opacity: hasUnread ? 1 : 0.3 }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.iconBrown }}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {loading && notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={Colors.tabActive} />
        </View>
      ) : notifications.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Ionicons
            name="notifications-off-outline"
            size={52}
            color={Colors.textDisabled}
          />
          <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.textDisabled }}>
            No notifications yet
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10 }}
        >
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.notificationId}
              onPress={() => {
                if (!notification.isRead) markAsRead(notification.notificationId);
              }}
              onLongPress={() => deleteNotification(notification.notificationId)}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
                backgroundColor: notification.isRead
                  ? Colors.bgCard
                  : Colors.bgCard2,
                borderRadius: 16,
                padding: 14,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors.bgAccent,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={TYPE_ICON[notification.type] ?? "notifications-outline"}
                  size={20}
                  color={Colors.iconOrange}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.textPrimary,
                    fontWeight: notification.isRead ? "400" : "600",
                  }}
                >
                  {notification.message}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 4 }}>
                  {formatRelativeTime(notification.createdAt)}
                </Text>
              </View>

              {!notification.isRead && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: Colors.iconOrange,
                    marginTop: 4,
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}