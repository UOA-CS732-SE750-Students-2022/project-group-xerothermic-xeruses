import { FlockIntervalDTO, UserAvailabilityIntervalInputDTO, UserIntervalInputDTO } from '@flocker/api-types';
import { InputType, Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FlockAvailabilityIntervalGraphQLModel implements FlockIntervalDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;

  @Field(() => Boolean, { nullable: false })
  available!: boolean;
}
