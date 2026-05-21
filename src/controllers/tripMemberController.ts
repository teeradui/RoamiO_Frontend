import { useState } from 'react';
import { tripMemberService } from '@/src/services/tripMemberService';
import { TripMember, UpdateMemberPayload } from '@/src/models/TripMember';

export function useTripMemberController(tripId: number) {
    const [members, setMembers] = useState<TripMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tripMemberService.getMembers(tripId);
            setMembers(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const updateMember = async (participantId: number, payload: UpdateMemberPayload) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await tripMemberService.updateMember(tripId, participantId, payload);
            setMembers((prev) =>
                prev.map((m) => (m.participantId === participantId ? updated : m))
            );
            return
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const removeMember = async (participantId: number) : Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await tripMemberService.removeMember(tripId, participantId);
            setMembers((prev) =>
                prev.filter((m) => m.participantId !== participantId)
            );
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        members,
        loading,
        error,
        fetchMembers,
        updateMember,
        removeMember
    };
}