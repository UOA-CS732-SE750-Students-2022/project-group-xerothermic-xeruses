import type { UserDTO } from './user';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface FlockDTO {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  startHour: number;
  endHour: number;
  users: UserDTO[];
}
