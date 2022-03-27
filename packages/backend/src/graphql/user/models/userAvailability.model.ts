import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { UserAvailabilityPartial } from '~/database/user/userAvailability.schema';

@ObjectType()
export class UserAvailabilityGraphQLModel implements UserAvailabilityPartial {
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
