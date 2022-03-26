import { createUnionType, Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { UserAvailabilityClassT } from '~/database/user/userAvailability.schema';

@ObjectType()
export class UserAvailabilityGraphqlSchema implements UserAvailabilityClassT {
  @Field()
  type!: string;

  @Field()
  uri: string | undefined;

  @Field()
  refreshToken: string | undefined;

  @Field()
  accessToken: string | undefined;

  @Field(() => UserAvailabilityDateUnion)
  accessTokenExpiration: Date | undefined;
}

const UserAvailabilityDateUnion = createUnionType({
  name: 'UserAvailabilityDate',
  types: () => [Date, undefined] as const,
});
