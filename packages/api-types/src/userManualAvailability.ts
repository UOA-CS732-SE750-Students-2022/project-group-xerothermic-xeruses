import { UserDTO } from './user';

/**
 * Used to return when a user explicitly marks themselves as available or not.
 */
export interface UserManualAvailabilityDTO {
  user: UserDTO;
  intervals: ManualAvailabilityDTO[];
}

/**
 * Used to represent an interval when a user is available or not.
 */
export interface ManualAvailabilityDTO {
  start: Date;
  end: Date;
  available: boolean;
}
