import { UserAvailabilityDTO, UserDTO, UserFlockAvailabilityDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLModel } from '~/graphql/user/models/user.model';
import { UserAvailabilityGraphQLModel } from '~/graphql/user/models/userAvailability.model';

@ObjectType()
export class UserFlockAvailabilityGraphQLModel implements UserFlockAvailabilityDTO {
  @Field(() => UserGraphQLModel, { nullable: false })
  user!: UserDTO;

  @Field(() => UserAvailabilityGraphQLModel, { nullable: false })
  userAvailability!: UserAvailabilityDTO;

  @Field({ nullable: false })
  enabled!: boolean;
}
