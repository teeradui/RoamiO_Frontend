import { TripMember, UpdateMemberPayload } from "@/src/models/TripMember";

const BASE_URL = "http://localhost:3000/api";

export const tripMemberService = {

    getMembers: async (tripId: number): Promise<TripMember[]> => {
        const res = await fetch(`${BASE_URL}/trips/${tripId}/members`);
        if (!res.ok) {
            throw new Error("Failed to fetch members");
        }
        return res.json();
    },

    updateMember: async (tripId: number, participantId: number, payload: UpdateMemberPayload): Promise<TripMember> => {
        const res = await fetch(`${BASE_URL}/trips/${tripId}/members/${participantId}`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error("Failed to update member");
        }
        return res.json();
    },

    removeMember: async (tripId: number, participantId: number): Promise<void> => {
        const res = await fetch(`${BASE_URL}/trips/${tripId}/members/${participantId}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Failed to remove member");
        }
    }
}