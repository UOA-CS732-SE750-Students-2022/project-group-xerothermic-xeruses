import { ManualAvailabilityDTO } from '@flocker/api-types';
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class ManualIntervalInput implements ManualAvailabilityDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;

  @Field({ nullable: false })
  available!: boolean;
}
