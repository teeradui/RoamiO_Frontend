export type MemberStatus = 'Participating' | 'Not_participating' | 'Cancelled' | 'Undecided';

export interface TripMember {
    participantId: number;
    tripId: number;
    userId: number;
    memberStatus: MemberStatus;
    profileImage?: string | null;
    username?: string;
    score?: number;
}

export interface UpdateMemberPayload {
    memberStatus: MemberStatus;
}