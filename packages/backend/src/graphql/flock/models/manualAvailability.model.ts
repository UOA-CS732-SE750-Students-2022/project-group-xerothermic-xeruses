import { ManualAvailabilityDTO } from '@flocker/api-types';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ManualAvailabilityGraphQLModel implements ManualAvailabilityDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;
}
