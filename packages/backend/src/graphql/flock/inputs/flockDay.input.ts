import { FlockDayDTO } from '@flocker/api-types';
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class FlockDayInput implements FlockDayDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;
}
