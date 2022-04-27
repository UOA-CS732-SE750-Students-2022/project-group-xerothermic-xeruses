import { UserDTO } from './user';
import { UserAvailabilityDTO } from './userAvailability';

/**
 * Used to return the representation of a users calendar being disabled/enabled for a flock.
 */
export interface UserFlockAvailabilityDTO {
  user: UserDTO;
  userAvailability: UserAvailabilityDTO;
  enabled: boolean;
}

/**
 * Used to enable/disable a users calendar for a flock.
 */
export interface UserFlockAvailabilityInputDTO {
  userAvailability: string;
  enabled: boolean;
}
