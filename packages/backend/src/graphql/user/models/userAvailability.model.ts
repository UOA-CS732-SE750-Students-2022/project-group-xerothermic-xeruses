import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { UserAvailabilityPartial } from '~/database/user/userAvailability.schema';

@ObjectType()
export class UserAvailabilityGraphQLModel implements UserAvailabilityPartial {
  @Field({ nullable: false })
  type!: string;

  @Field(() => GraphQLString)
  uri: string | undefined;

  @Field(() => GraphQLString)
  refreshToken: string | undefined;

  @Field(() => GraphQLString)
  accessToken: string | undefined;

  @Field(() => Date)
  accessTokenExpiration: Date | undefined;
}
