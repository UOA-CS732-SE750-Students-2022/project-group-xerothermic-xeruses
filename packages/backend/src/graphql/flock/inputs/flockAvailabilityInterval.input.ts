import { FlockAvailabilityIntervalInputDTO, FlockIntervalInputDTO } from '@flocker/api-types';
import { InputType, Field } from '@nestjs/graphql';
import { FlockIntervalInput } from './flockInterval.input';

@InputType()
export class FlockAvailabilityIntervalInput implements FlockAvailabilityIntervalInputDTO {
  @Field(() => [FlockIntervalInput], { nullable: false })
  intervals!: FlockIntervalInputDTO[];
}
