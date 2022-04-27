import { UserFlockAvailabilityDTO } from '@flocker/api-types';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UserFlockAvailabilityInput implements UserFlockAvailabilityDTO {
  @Field(() => ID, { nullable: false })
  flockAvailability!: string;

  @Field({ nullable: false })
  enabled!: boolean;
}
