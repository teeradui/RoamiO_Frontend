export type MemberStatus = 'Participating' | 'Not_participating' | 'Cancelled' | 'Undecided';

export interface TripMember {
    participantId: number;
    tripId: number;
    userId: number;
    memberStatus: MemberStatus;
}

export interface UpdateMemberPayload {
    memberStatus: MemberStatus;
}