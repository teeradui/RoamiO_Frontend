
export type InviteStatus = 'Cancelled' | 'Accepted' | 'Rejected' | 'Undecided';

export interface TripInvite {
    tripInviteId: number;
    tripId: number;
    userId: number;
    inviteStatus: InviteStatus;
}

export interface CreateInvitePayload {
    userId: number;
}

export interface UpdateInvitePayload {
    inviteStatus: InviteStatus;
}