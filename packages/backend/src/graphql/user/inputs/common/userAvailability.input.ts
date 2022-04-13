import { UserAvailability } from '@flocker/api-types';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

@InputType()
export class UserAvailabilityInput implements UserAvailabilityPartial {
  @Field({ nullable: false })
  type!: string;

  @Field(() => GraphQLString, { nullable: true })
  uri: string | undefined;

  @Field(() => GraphQLString, { nullable: true })
  refreshToken: string | undefined;

  @Field(() => GraphQLString, { nullable: true })
  accessToken: string | undefined;

  @Field(() => Date, { nullable: true })
  accessTokenExpiration: Date | undefined;
}
