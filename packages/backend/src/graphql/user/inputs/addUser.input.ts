import { AddUserInputDTO } from '@flocker/api-types';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddUserInput implements AddUserInputDTO {
  @Field({ nullable: false })
  name!: string;
}
