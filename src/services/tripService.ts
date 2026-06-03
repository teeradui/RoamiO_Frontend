import { CreateTripPayload, Trip, UpdateTripPayload } from "@/src/models/Trip";

const BASE_URL = "http://10.120.67.97:3000/api";

export const tripService = {
  getAllTrips: async (): Promise<Trip[]> => {
    const res = await fetch(`${BASE_URL}/trips`, {});
    if (!res.ok) {
      throw new Error("Failed to fetch trips");
    }
    return res.json();
  },

  getUpcomingTrips: async (): Promise<Trip[]> => {
    const res = await fetch(`${BASE_URL}/trips/status/upcoming`);
    if (!res.ok) {
      throw new Error("Failed to fetch upcoming trips");
    }
    return res.json();
  },

  getActiveTrips: async (): Promise<Trip[]> => {
    const res = await fetch(`${BASE_URL}/trips/status/active`);
    if (!res.ok) {
      throw new Error("Failed to fetch active trips");
    }
    return res.json();
  },

  getCompletedTrips: async (): Promise<Trip[]> => {
    const res = await fetch(`${BASE_URL}/trips/status/completed`);
    if (!res.ok) {
      throw new Error("Failed to fetch completed trips");
    }
    return res.json();
  },

  createTrip: async (payload: CreateTripPayload): Promise<Trip> => {
    const formData = new FormData();

    
    formData.append("tripName", payload.tripName);
    formData.append("startTime", payload.startTime);
    formData.append("endTime", payload.endTime);
    formData.append("meetUpTime", payload.meetUpTime);
    formData.append("tripDestination", payload.tripDestination);
    if (payload.meetingPoint) {
      formData.append("meetingPoint", payload.meetingPoint);
    }
    if (payload.image) {
      formData.append("image", {
        uri: payload.image.uri,
        name: payload.image.name,
        type: payload.image.type,
      } as any);
    }

    const res = await fetch(`${BASE_URL}/trips`, {
      method: "POST",
      body: formData,
    });

    console.log('createTrip status:', res.status);
    const responseText = await res.text();
    console.log('createTrip response:', responseText);

    const data = JSON.parse(responseText);

    if (!res.ok) {
      throw new Error(data.error || "Failed to create trip");
    }

    return data.trip;
    //return JSON.parse(responseText);
    //return res.json();
  },

  updateTrip: async (
    tripId: number,
    payload: UpdateTripPayload,
  ): Promise<Trip> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to update trip");
    }
    return res.json();
  },

  updateTripStatus: async (tripId: number, tripStatus: string): Promise<Trip> => {
      const res = await fetch(`${BASE_URL}/trips/${tripId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: tripStatus }),
      });
      if (!res.ok) {
          throw new Error("Failed to update trip status");
      }
      const data = await res.json();
      return data.trip;
  },

  deleteTrip: async (tripId: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete trip");
    }
  },
};
