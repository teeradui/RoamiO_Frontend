import {
    Attendance,
    LatestLocation,
    SaveLocationPayload,
    TripLocation,
    TripStart,
} from "@/src/models/TripLocation";

const BASE_URL = "http://10.120.67.97:3000/api";

export const tripLocationService = {
  getStart: async (tripId: number): Promise<TripStart> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/location/start`);
    if (!res.ok) {
      throw new Error("Failed to fetch trip start data");
    }
    return res.json();
  },

  saveLocation: async (
    tripId: number,
    payload: SaveLocationPayload,
  ): Promise<TripLocation> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/location`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to save location");
    }
    return data.location;
  },

  getLatestLocations: async (tripId: number): Promise<LatestLocation[]> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/location/latest`);
    if (!res.ok) {
      throw new Error("Failed to fetch latest locations");
    }
    return res.json();
  },

  getAttendance: async (tripId: number): Promise<Attendance[]> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/location/attendance`);
    if (!res.ok) {
      throw new Error("Failed to fetch attendance");
    }
    return res.json();
  },
};