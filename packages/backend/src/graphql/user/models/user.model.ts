import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { UserAvailabilityGraphQLModel } from './userAvailability.model';
import { User } from '~/database/user/user.schema';
import { UserAvailability } from '~/database/user/userAvailability.schema';

@ObjectType()
export class UserGraphQLModel implements User {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  // TODO: this should resolve to a populated Flock.
  @Field(() => [ID])
  flocks!: Types.ObjectId[];

  // TODO: this should resolve to populated Flocks.
  @Field(() => [ID])
  flockInvites!: Types.ObjectId[];

  // TODO(mattm): this should never be exposed to any user since it contains secrets.
  @Field(() => [UserAvailabilityGraphQLModel])
  availability!: UserAvailability[];
}
