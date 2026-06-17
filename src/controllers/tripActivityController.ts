import { Activity, Stop } from "@/src/models/TripActivity";
import { tripActivityService } from "@/src/services/tripActivityService";
import { useState } from "react";

export function useTripActivityController(tripId: number) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [timeline, setTimeline] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripActivityService.getStops(tripId);
      setStops(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityByStop = async (
    stopId: number,
  ): Promise<Activity | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripActivityService.getActivityByStop(
        tripId,
        stopId,
      );
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripActivityService.getTimeline(tripId);
      setTimeline(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    stops,
    timeline,
    loading,
    error,
    fetchStops,
    fetchActivityByStop,
    fetchTimeline,
  };
}