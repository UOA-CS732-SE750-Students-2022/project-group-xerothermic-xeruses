import type { FlockDTO } from './flock';
import type { UserAvailabilityDTO } from './userAvailability';
import type { UserSettingsDTO } from './userSettings';

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export interface UserDTO {
  id: string;
  name: string;
  flocks: FlockDTO[];
  flockInvites: FlockDTO[];
  availability: UserAvailabilityDTO[];
  settings?: UserSettingsDTO;
}
