import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { UserAvailabilityGraphqlSchema } from './userAvailability.model';
import { User } from '~/database/user/user.schema';
import { UserAvailability } from '~/database/user/userAvailability.schema';

@ObjectType()
export class UserGraphqlSchema implements User {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => [ID])
  flocks!: Types.ObjectId[];

  @Field(() => [ID])
  flockInvites!: Types.ObjectId[];

  @Field(() => [UserAvailabilityGraphqlSchema])
  availability!: UserAvailability[];
}
