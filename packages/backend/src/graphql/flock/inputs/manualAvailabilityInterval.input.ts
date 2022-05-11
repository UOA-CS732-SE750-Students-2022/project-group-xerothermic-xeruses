import { ManualAvailabilityDTO, UserManualAvailabilityDTO } from '@flocker/api-types';
import { InputType, Field } from '@nestjs/graphql';
import { ManualIntervalInput } from './manualInterval.input';

@InputType()
export class ManualAvailabilityIntervalInput implements Partial<UserManualAvailabilityDTO> {
  @Field(() => [ManualIntervalInput], { nullable: false })
  intervals!: ManualAvailabilityDTO[];
}
