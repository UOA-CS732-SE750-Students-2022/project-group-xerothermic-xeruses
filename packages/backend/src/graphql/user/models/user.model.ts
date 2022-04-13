import type { Flock, User, UserAvailability, UserSettings } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { FlockGraphQLModel } from '../../flock/models/flock.model';
import { UserAvailabilityGraphQLModel } from './userAvailability.model';
import { UserSettingsGraphQLModel } from './userSettings.model';

@ObjectType()
export class UserGraphQLModel implements User {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => [FlockGraphQLModel], { nullable: false })
  flocks!: Flock[];

  @Field(() => [FlockGraphQLModel], { nullable: false })
  flockInvites!: Flock[];

  // TODO(mattm): this should never be exposed to any user since it contains secrets.
  @Field(() => [UserAvailabilityGraphQLModel], { nullable: false })
  availability!: UserAvailability[];

  @Field(() => UserSettingsGraphQLModel, { nullable: true })
  settings: UserSettings | undefined;
}
