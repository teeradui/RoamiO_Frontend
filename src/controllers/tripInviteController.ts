import { useState } from 'react';
import { tripInviteService } from '@/src/services/tripInviteService';
import { TripInvite, CreateInvitePayload, UpdateInvitePayload } from '@/src/models/TripInvite';

export function useTripInviteController(tripId: number) {
    const [invites, setInvites] = useState<TripInvite[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInvites = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tripInviteService.getInvites(tripId);
            setInvites(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const sendInvite = async (payload: CreateInvitePayload) : Promise<TripInvite | null> => {
        setLoading(true);
        setError(null);
        try {
            const newInvite = await tripInviteService.sendInvite(tripId, payload);
            setInvites((prev) => [...prev, newInvite]);
            return newInvite;
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateInvite = async (tripInviteId: number, payload: UpdateInvitePayload) : Promise<TripInvite | null> => {
        setLoading(true);
        setError(null);
        try {
            const updated = await tripInviteService.updateInvite(tripId, tripInviteId, payload);
            setInvites((prev) =>
                prev.map((i) => (i.tripInviteId === tripInviteId ? updated : i))
            );
            return updated;
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        invites,
        loading,
        error,
        fetchInvites,
        sendInvite,
        updateInvite
    };
}