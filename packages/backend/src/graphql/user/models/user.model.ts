import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { User } from '~/database/user/user.schema';
import { UserAvailability } from '~/database/user/userAvailability.schema';
import { UserSettings } from '~/database/user/userSettings.schema';
import { UserAvailabilityGraphQLModel } from './userAvailability.model';
import { UserSettingsGraphQLModel } from './userSettings.model';

@ObjectType()
export class UserGraphQLModel implements User {
  @Field(() => ID)
  id!: Types.ObjectId;

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

  @Field(() => UserSettingsGraphQLModel, { nullable: true })
  settings: UserSettings | undefined;
}
