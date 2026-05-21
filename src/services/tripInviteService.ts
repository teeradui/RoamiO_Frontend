import {TripInvite, CreateInvitePayload, UpdateInvitePayload} from "@/src/models/TripInvite";

const BASE_URL = "http://localhost:3000/api";

export const tripInviteService = {

    getInvites: async (tripId: number): Promise<TripInvite[]> => {
        const res = await fetch(`${BASE_URL}/trips/${tripId}/invites`);
        if (!res.ok) {
            throw new Error("Failed to fetch invites");
        }
        return res.json();
    },

    sendInvite: async (tripId: number, payload: CreateInvitePayload): Promise<TripInvite> => {
        const res = await fetch(`${BASE_URL}/trips/${tripId}/invites`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error("Failed to send invite");
        }
        return res.json();
    },

    updateInvite: async (tripId: number, tripInviteId: number, payload: UpdateInvitePayload): Promise<TripInvite> => {
        const res = await fetch(`${BASE_URL}/trips/${tripId}/invites/${tripInviteId}`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error("Failed to update invite");
        }
        return res.json();
    }
}