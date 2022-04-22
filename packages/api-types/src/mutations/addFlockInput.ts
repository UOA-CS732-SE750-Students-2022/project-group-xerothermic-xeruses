import { FlockDTO } from '../flock';

/**
 * Create a Flock.
 */
export interface AddFlockInputDTO extends Partial<FlockDTO> {
  name: string;
  startDate: Date;
  endDate: Date;
  startHour: number;
  endHour: number;
}
