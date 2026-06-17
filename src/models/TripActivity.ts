export interface Stop {
  stopId: number;
  tripId: number;
  userId: number;
  latitude: number;
  longitude: number;
  enteredAt: string;
  exitedAt: string | null;
  activityId: number | null;
}

export interface Activity {
  activityId: number;
  tripId: number;
  userId: number;
  locationName: string;
  locationType: string;
  activityType: string;
  startTime: string;
  endTime: string;
  duration: number | null; // minutes
}

export interface DetectPlaceTypeResult {
  locationName: string;
  locationType: string;
  types: string[];
}

export interface ConfirmStopPayload {
  userId: number;
  latitude: number;
  longitude: number;
  timestamp?: string;
}

export interface DetectPlaceTypePayload {
  latitude: number;
  longitude: number;
}