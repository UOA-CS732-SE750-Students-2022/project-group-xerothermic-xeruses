import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  id: number;

  @Field()
  name: string;
}
