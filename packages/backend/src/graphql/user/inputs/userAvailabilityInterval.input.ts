import { UserAvailabilityIntervalInputDTO, UserIntervalInputDTO } from '@flocker/api-types';
import { InputType, Field } from '@nestjs/graphql';
import { UserIntervalInput } from './userInterval.input';

@InputType()
export class UserAvailabilityIntervalInput implements UserAvailabilityIntervalInputDTO {
  @Field(() => [UserIntervalInput], { nullable: false })
  intervals!: UserIntervalInputDTO[];
}
