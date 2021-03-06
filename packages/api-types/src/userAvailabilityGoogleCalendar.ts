/**
 * Google Calendar datasource for user availability.
 */
export const USER_AVAILABILITY_GOOGLE_CALENDAR = 'googlecalendar';

/**
 * Google Calendar datasource for user availability.
 */
export interface UserAvailabilityGoogleCalendarDTO {
  type: typeof USER_AVAILABILITY_GOOGLE_CALENDAR;
  refreshToken: string;
  calendarId: string;
}
