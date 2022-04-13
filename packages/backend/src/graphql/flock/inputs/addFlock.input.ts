import { AddFlockInputDTO } from '@flocker/api-types';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddFlockInput implements AddFlockInputDTO {
  @Field({ nullable: false })
  name!: string;
}
