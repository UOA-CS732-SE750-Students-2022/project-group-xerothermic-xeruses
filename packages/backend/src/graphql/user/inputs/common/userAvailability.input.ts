import { UserAvailabilityCombinedDTO } from '@flocker/api-types';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

@InputType()
export class UserAvailabilityInput implements Partial<UserAvailabilityCombinedDTO> {
  @Field({ nullable: false })
  type!: string;

  @Field(() => GraphQLString, { nullable: true })
  uri?: string;

  @Field(() => GraphQLString, { nullable: true })
  refreshToken?: string;

  @Field(() => GraphQLString, { nullable: true })
  accessToken?: string;

  @Field(() => Date, { nullable: true })
  accessTokenExpiration?: Date;
}
