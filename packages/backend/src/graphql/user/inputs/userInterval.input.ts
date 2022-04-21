import { UserIntervalInputDTO } from '@flocker/api-types';
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class UserIntervalInput implements UserIntervalInputDTO {
  @Field(() => GraphQLISODateTime, { nullable: false })
  start!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  end!: Date;
}
