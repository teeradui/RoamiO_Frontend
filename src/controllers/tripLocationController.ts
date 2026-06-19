import {
  Attendance,
  LatestLocation,
  SaveLocationPayload,
  TripStart,
} from "@/src/models/TripLocation";
import { tripLocationService } from "@/src/services/tripLocationService";
import { useState } from "react";

export function useTripLocationController(tripId: number) {
  const [tripStart, setTripStart] = useState<TripStart | null>(null);
  const [latestLocations, setLatestLocations] = useState<LatestLocation[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripLocationService.getStart(tripId);
      setTripStart(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (
    payload: SaveLocationPayload,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await tripLocationService.saveLocation(tripId, payload);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripLocationService.getLatestLocations(tripId);
      setLatestLocations(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripLocationService.getAttendance(tripId);
      setAttendance(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  

  return {
    tripStart,
    latestLocations,
    attendance,
    loading,
    error,
    fetchStart,
    saveLocation,
    fetchLatestLocations,
    fetchAttendance,
  };
}