import {
    Activity,
    Stop
} from "@/src/models/TripActivity";

const BASE_URL = "http://10.120.67.97:3000/api";

export const tripActivityService = {
  getStops: async (tripId: number): Promise<Stop[]> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/activities/stops`);
    if (!res.ok) {
      throw new Error("Failed to fetch stops");
    }
    return res.json();
  },

  getActivityByStop: async (
    tripId: number,
    stopId: number,
  ): Promise<Activity> => {
    const res = await fetch(
      `${BASE_URL}/trips/${tripId}/activities/stops/${stopId}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch activity for this stop");
    }
    return res.json();
  },

  getTimeline: async (tripId: number): Promise<Activity[]> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/activities/timeline`);
    if (!res.ok) {
      throw new Error("Failed to fetch activity timeline");
    }
    return res.json();
  },
};