import { useState, useEffect} from 'react';
import { tripService } from '@/src/services/tripService';
import { Trip, CreateTripPayload, UpdateTripPayload } from '@/src/models/Trip';

export function useTripController() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllTrips = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tripService.getAllTrips();
            setTrips(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUpcomingTrips = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tripService.getUpcomingTrips();
            setTrips(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchActiveTrips = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tripService.getActiveTrips();
            setTrips(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompletedTrips = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tripService.getCompletedTrips();
            setTrips(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const createTrip = async (payload: CreateTripPayload): Promise<Trip | null> => {
        setLoading(true);
        setError(null);
        try {
            const newTrip = await tripService.createTrip(payload);
            setTrips((prev) => [newTrip, ...prev]);
            return newTrip;
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateTrip = async (tripId: number, payload: UpdateTripPayload): Promise<Trip | null> => {
        setLoading(true);
        setError(null);
        try {
            const updated = await tripService.updateTrip(tripId, payload);
            setTrips((prev) => prev.map((t) => t.tripId === tripId ? updated : t));
            return updated;
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateTripStatus = async (tripId: number, tripStatus: string): Promise<Trip | null> => {
        setLoading(true);
        setError(null);
        try {
            const updated = await tripService.updateTripStatus(tripId, tripStatus);
            setTrips((prev) => prev.map((t) => t.tripId === tripId ? updated : t));
            return updated;
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteTrip = async (tripId: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await tripService.deleteTrip(tripId);
            setTrips((prev) => prev.filter((t) => t.tripId !== tripId));
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        trips,
        loading,
        error,
        fetchAllTrips,
        fetchUpcomingTrips,
        fetchActiveTrips,
        fetchCompletedTrips,
        createTrip,
        updateTrip,
        updateTripStatus,
        deleteTrip,
    };
}