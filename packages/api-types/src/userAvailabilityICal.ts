/**
 * External .ical datasource for user availability.
 */
export const USER_AVAILABILITY_ICAL = 'ical';

/**
 * External .ical datasource for user availability.
 */
export interface UserAvailabilityICalDTO {
  type: typeof USER_AVAILABILITY_ICAL;
  uri: string;
}
