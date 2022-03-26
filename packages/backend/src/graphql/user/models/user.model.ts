import { Field, Int, ObjectType } from '@nestjs/graphql';
import { type Types } from 'mongoose';
import { User } from '~/database/user/user.schema';
import { UserAvailability } from '~/database/user/userAvailability.schema';

@ObjectType()
export class UserGraphqlSchema implements User {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  flocks!: Types.ObjectId[];

  @Field()
  flockInvites!: Types.ObjectId[];

  @Field()
  availability!: UserAvailability[];
}
