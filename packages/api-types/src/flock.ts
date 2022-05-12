import type { UserDTO } from './user';
import { UserFlockAvailabilityDTO } from './userFlockAvailability';
import { UserManualAvailabilityDTO } from './userManualAvailability';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface FlockDTO {
  id: string;
  name: string;
  flockCode: string;
  flockDays: FlockDayDTO[];
  users: UserDTO[];
  userFlockAvailability: UserFlockAvailabilityDTO[];
  userManualAvailability: UserManualAvailabilityDTO[];
}

export interface FlockDayDTO {
  start: Date;
  end: Date;
}
