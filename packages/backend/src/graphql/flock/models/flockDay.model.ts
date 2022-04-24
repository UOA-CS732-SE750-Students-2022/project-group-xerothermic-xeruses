import { FlockDayDTO } from '@flocker/api-types';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FlockDayGraphQLModel implements FlockDayDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;
}
