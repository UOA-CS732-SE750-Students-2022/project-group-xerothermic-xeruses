import type { FlockDTO } from './flock';
import type { UserAvailabilityDTO } from './useravailability';
import type { UserSettingsDTO } from './usersettings';

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
