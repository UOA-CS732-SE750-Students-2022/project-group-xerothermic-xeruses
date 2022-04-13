import type { FlockDTO, UserDTO, UserAvailabilityDTO, UserSettingsDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { FlockGraphQLModel } from '../../flock/models/flock.model';
import { UserAvailabilityGraphQLModel } from './userAvailability.model';
import { UserSettingsGraphQLModel } from './userSettings.model';

@ObjectType()
export class UserGraphQLModel implements UserDTO {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => [FlockGraphQLModel], { nullable: false })
  flocks!: FlockDTO[];

  @Field(() => [FlockGraphQLModel], { nullable: false })
  flockInvites!: FlockDTO[];

  // TODO(mattm): this should never be exposed to any user since it contains secrets.
  @Field(() => [UserAvailabilityGraphQLModel], { nullable: false })
  availability!: UserAvailabilityDTO[];

  @Field(() => UserSettingsGraphQLModel, { nullable: true })
  settings: UserSettingsDTO | undefined;
}
