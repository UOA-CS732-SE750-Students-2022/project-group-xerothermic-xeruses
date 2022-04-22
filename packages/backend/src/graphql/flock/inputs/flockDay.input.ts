import { FlockDayDTO } from '@flocker/api-types';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FlockDayInput implements FlockDayDTO {
  @Field({ nullable: false })
  start!: string;

  @Field({ nullable: false })
  end!: string;
}
