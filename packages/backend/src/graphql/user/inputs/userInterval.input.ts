import { UserIntervalInputDTO } from '@flocker/api-types';
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class UserIntervalInput implements UserIntervalInputDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  startDate!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  endDate!: Date;

  @Field({ nullable: true })
  availabilityStartHour!: number;

  @Field({ nullable: true })
  availabilityEndHour!: number;
}
