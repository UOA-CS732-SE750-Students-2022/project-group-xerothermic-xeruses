import { UserAvailabilityPartial } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

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
