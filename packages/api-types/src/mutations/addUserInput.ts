import { UserDTO } from '../user';
import { UserSettingsDTO } from '../userSettings';

/**
 * Create a User.
 */
export interface AddUserInputDTO extends Partial<UserDTO> {
  name: string;
  settings?: UserSettingsDTO;
}
