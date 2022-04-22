import { AddFlockInputDTO } from '@flocker/api-types';
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class AddFlockInput implements AddFlockInputDTO {
  @Field({ nullable: false })
  name!: string;

  @Field(() => GraphQLISODateTime, { nullable: false })
  startDate!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  endDate!: Date;

  @Field({ nullable: false })
  startHour!: number;

  @Field({ nullable: false })
  endHour!: number;
}
