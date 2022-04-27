import { UserAvailabilityDTO, UserFlockAvailabilityDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserAvailabilityGraphQLModel } from '~/graphql/user/models/userAvailability.model';

@ObjectType()
export class UserFlockAvailabilityGraphQLModel implements UserFlockAvailabilityDTO {
  @Field(() => UserAvailabilityGraphQLModel, { nullable: false })
  flockAvailability!: UserAvailabilityDTO;

  @Field({ nullable: false })
  enabled!: boolean;
}
