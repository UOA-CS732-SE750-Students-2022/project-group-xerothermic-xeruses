import { UserAvailabilityCombinedDTO } from '@flocker/api-types';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

@InputType()
export class UserAvailabilityInput implements Partial<UserAvailabilityCombinedDTO> {
  @Field({ nullable: false })
  type!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => GraphQLString, { nullable: true })
  uri?: string;

  /**
   * Google Calendar fields are omitted here, because the Google auth
   * service communicates directly with the server to add calendars.
   */
}
