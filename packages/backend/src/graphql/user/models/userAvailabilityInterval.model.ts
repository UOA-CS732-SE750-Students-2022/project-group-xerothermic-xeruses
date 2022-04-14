import { UserAvailabilityIntervalDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserIntervalGraphQLModel } from './userInterval.model';

@ObjectType()
export class UserAvailabilityIntervalGraphQLModel implements UserAvailabilityIntervalDTO {
  @Field(() => [UserIntervalGraphQLModel], { nullable: false })
  availability!: UserIntervalGraphQLModel[];
}
