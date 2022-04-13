import { Field, ObjectType } from '@nestjs/graphql';
import { UserIntervalGraphQLModel } from './userInterval.model';

@ObjectType()
export class UserAvailabilityIntervalGraphQLModel {
  @Field(() => [UserIntervalGraphQLModel], { nullable: false })
  intervals!: UserIntervalGraphQLModel[];
}
