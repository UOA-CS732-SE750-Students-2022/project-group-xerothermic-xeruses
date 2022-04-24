import { AddFlockInputDTO, FlockDayDTO } from '@flocker/api-types';
import { InputType, Field } from '@nestjs/graphql';
import { FlockDayInput } from './flockDay.input';

@InputType()
export class AddFlockInput implements AddFlockInputDTO {
  @Field({ nullable: false })
  name!: string;

  @Field(() => [FlockDayInput], { nullable: false })
  flockDays!: FlockDayDTO[];
}
