import { FlockDayDTO, FlockDTO } from '../flock';

/**
 * Create a Flock.
 */
export interface AddFlockInputDTO extends Partial<FlockDTO> {
  name: string;
  flockDays: FlockDayDTO[];
}
