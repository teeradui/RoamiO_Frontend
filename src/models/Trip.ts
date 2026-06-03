import { Image } from 'react-native';
export type TripStatus = 'Upcoming' | 'Active' | 'Completed';

export interface Trip {
    tripId: number;
    tripName: string;
    startTime: string;
    endTime: string;
    meetUpTime: string;
    tripDestination: string;
    meetingPoint: string | null;
    imageUrl: string | null;
    tripStatus: TripStatus;
    createdBy: number;
}

export interface CreateTripPayload {
    tripName: string;
    startTime: string;
    endTime: string;
    meetUpTime: string;
    tripDestination: string;
    meetingPoint?: string;
    image?: {
        uri: string;
        name: string;
        type: string;
    };
}

export interface UpdateTripPayload {
    tripName?: string;
    startTime?: string;
    endTime?: string;
    meetUpTime?: string;
    tripDestination?: string;
    meetingPoint?: string;
    image?: {
        uri: string;
        name: string;
        type: string;
    };
}