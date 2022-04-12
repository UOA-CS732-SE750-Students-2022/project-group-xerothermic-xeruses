import type { User } from './user';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface Flock {
  id: string;
  name: string;
  users: User[];
}
