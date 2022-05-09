import { UserAvailabilityPartialDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

@ObjectType()
export class UserAvailabilityGraphQLModel implements UserAvailabilityPartialDTO {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  type!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => GraphQLString, { nullable: true })
  uri: string | undefined;

  @Field(() => GraphQLString, { nullable: true })
  refreshToken: string | undefined;

  @Field(() => GraphQLString, { nullable: true })
  calendarId: string | undefined;
}
