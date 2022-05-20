import { UserAvailabilityIntervalDTO, UserIntervalDTO } from '@flocker/api-types';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { UserIntervalGraphQLModel } from './userInterval.model';

@ObjectType()
export class UserAvailabilityIntervalGraphQLModel implements UserAvailabilityIntervalDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;

  @Field(() => [UserIntervalGraphQLModel], { nullable: false })
  availability!: UserIntervalDTO[];
}
