import { Colors } from "@/constants/theme";
import { useTripActivityController } from "@/src/controllers/tripActivityController";
import { Trip } from "@/src/models/Trip";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type Props = {
  trip: Trip;
};

export default function ActivitiesTab({ trip }: Props) {
  const { timeline, loading, fetchTimeline } = useTripActivityController(
    trip.tripId,
  );

  useEffect(() => {
    fetchTimeline();
  }, [trip.tripId]);

  if (loading && timeline.length === 0) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 60 }}>
        <ActivityIndicator size="small" color={Colors.tabActive} />
      </View>
    );
  }

  if (timeline.length === 0) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 60,
          gap: 12,
        }}
      >
        <Ionicons name="radio-outline" size={52} color={Colors.textDisabled} />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: Colors.textDisabled,
          }}
        >
          Activities will be detected automatically
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: Colors.textDisabled,
            textAlign: "center",
          }}
        >
          Based on stops, location types and duration
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {timeline.map((activity) => (
        <View
          key={activity.activityId}
          style={{
            backgroundColor: Colors.bgCard2,
            borderRadius: 16,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: Colors.bgAccent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="location-outline" size={22} color={Colors.iconBrown} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: Colors.textPrimary,
              }}
            >
              {activity.locationName}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}