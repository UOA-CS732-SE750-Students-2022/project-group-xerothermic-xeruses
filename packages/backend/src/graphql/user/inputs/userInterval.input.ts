import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class UserIntervalInput {
  @Field(() => GraphQLISODateTime, { nullable: false })
  startDate!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  endDate!: Date;

  @Field({ nullable: true })
  availabilityStartHour!: number;

  @Field({ nullable: true })
  availabilityEndHour!: number;
}
