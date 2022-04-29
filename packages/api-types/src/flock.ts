import type { UserDTO } from './user';
import { UserFlockAvailabilityDTO } from './userFlockAvailability';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface FlockDTO {
  id: string;
  name: string;
  flockDays: FlockDayDTO[];
  users: UserDTO[];
  userFlockAvailability: UserFlockAvailabilityDTO[];
}

export interface FlockDayDTO {
  start: Date;
  end: Date;
}
