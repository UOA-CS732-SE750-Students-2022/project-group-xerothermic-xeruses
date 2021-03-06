import { UserFlockAvailabilityInputDTO } from '@flocker/api-types';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UserFlockAvailabilityInput implements UserFlockAvailabilityInputDTO {
  @Field(() => ID, { nullable: false })
  userAvailabilityId!: string;

  @Field({ nullable: false })
  enabled!: boolean;
}
