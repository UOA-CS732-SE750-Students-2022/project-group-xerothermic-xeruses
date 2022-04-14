import { UserIntervalDTO } from '@flocker/api-types';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserIntervalGraphQLModel implements UserIntervalDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  date!: Date;

  @Field(() => [Boolean], { nullable: false })
  intervals!: boolean[];
}
