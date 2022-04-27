import { UserAvailabilityDTO } from './userAvailability';

/**
 * Used to return the users availability for all dates.
 */
export interface UserFlockAvailabilityDTO {
  // We can send back the entire calendar on response, but only want to provide the calendar id on request.
  flockAvailability: UserAvailabilityDTO | string;
  enabled: boolean;
}
