import { UserDTO } from '../user';

/**
 * Create a User.
 */
export interface AddUserInputDTO extends Partial<UserDTO> {
  name: string;
}
