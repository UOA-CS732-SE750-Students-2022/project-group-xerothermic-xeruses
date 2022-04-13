import { InputType, Field, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Flock } from '@flocker/api-types';

@InputType()
export class AddFlockInput implements Flock {
  @Field({ nullable: false })
  name!: string;

  @Field(() => [ID], { nullable: true })
  users!: Types.ObjectId[];
}
