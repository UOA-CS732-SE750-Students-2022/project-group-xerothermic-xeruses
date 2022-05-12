import { ManualAvailabilityDTO, UserDTO, UserManualAvailabilityDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLModel } from '~/graphql/user/models/user.model';
import { ManualAvailabilityGraphQLModel } from './manualAvailability.model';

@ObjectType()
export class UserManualAvailabilityGraphQLModel implements UserManualAvailabilityDTO {
  @Field(() => UserGraphQLModel, { nullable: false })
  user!: UserDTO;

  @Field(() => [ManualAvailabilityGraphQLModel], { nullable: false })
  intervals!: ManualAvailabilityDTO[];
}
