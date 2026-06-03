export interface TripForm {
  tripName: string;
  startDate: Date | null;
  endDate: Date | null;
  destination: string;
  meetupTime: Date;
  meetingPoint: string;
  profilePhoto: string | null;
}