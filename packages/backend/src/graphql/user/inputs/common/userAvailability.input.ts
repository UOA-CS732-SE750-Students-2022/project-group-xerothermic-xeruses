import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { UserAvailabilityPartial } from '~/database/user/userAvailability.schema';

@InputType()
export class UserAvailabilityInput implements UserAvailabilityPartial {
  @Field()
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
