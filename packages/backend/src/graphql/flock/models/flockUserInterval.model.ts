import { FlockIntervalDTO } from '@flocker/api-types';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FlockIntervalGraphQLModel implements FlockIntervalDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;

  @Field(() => Boolean, { nullable: false })
  available!: boolean;
}
