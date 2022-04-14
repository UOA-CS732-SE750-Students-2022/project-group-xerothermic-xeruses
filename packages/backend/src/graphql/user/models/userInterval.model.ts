import { UserIntervalDTO } from '@flocker/api-types';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserIntervalGraphQLModel implements UserIntervalDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;

  @Field(() => Boolean, { nullable: false })
  available!: boolean;
}
