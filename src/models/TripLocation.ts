export interface TripStart {
  tripId: number;
  tripName: string;
  startTime: string;
  meetupTime: string | null;
  meetingPoint: string | null;
  tripStatus: string;
}

export interface TripLocation {
  locationId: number;
  tripId: number;
  userId: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface LatestLocation {
  userId: number;
  firstName: string;
  lastName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Attendance {
  userId: number;
  firstName: string;
  lastName: string;
  attendance: 'VeryEarly' | 'Early' | 'OnTime' | 'Late' | 'Missing' | 'Undecided';
}

export interface SaveLocationPayload {
  userId: number;
  latitude: number;
  longitude: number;
  locationTimestamp?: string;
}