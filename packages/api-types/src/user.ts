import type { Flock } from './flock';
import type { UserAvailability } from './useravailability';
import type { UserSettings } from './usersettings';

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export interface User {
  id: string;
  name: string;
  flocks: Flock[];
  flockInvites: Flock[];
  availability: UserAvailability[];
  settings?: UserSettings;
}
