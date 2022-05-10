import { UserDTO } from './user';

/**
 * Used to return when a user explicitly marks themselves as not available.
 */
export interface UserManualAvailabilityDTO {
  user: UserDTO;
  intervals: ManualAvailabilityDTO[];
}

/**
 * Used to represent an interval when a user is not available.
 */
export interface ManualAvailabilityDTO {
  start: Date;
  end: Date;
}
