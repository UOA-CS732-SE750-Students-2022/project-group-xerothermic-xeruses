import type { UserDTO } from './user';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface FlockDTO {
  id: string;
  name: string;
  users: UserDTO[];
}
