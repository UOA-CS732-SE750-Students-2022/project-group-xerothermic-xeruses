import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

export interface UserInterval {
  date: Date;
  availability: Boolean[];
}

@ObjectType()
export class UserIntervalGraphQLModel implements UserInterval {
  @Field(() => GraphQLISODateTime, { nullable: false })
  date!: Date;

  @Field(() => [Boolean], { nullable: false })
  availability!: Boolean[];
}
