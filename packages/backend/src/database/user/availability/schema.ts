import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';
import { NeverError } from '~/common/errors';

export interface UserAvailabilityModelICal {
  type: 'ical';
  uri: string;
}

export interface UserAvailabilityModelGoogleCalendar {
  type: 'googlecalendar';
  refreshToken: string;
  accessToken: string;
  accessTokenExpiration: Date;
}

export type UserAvailabilityModel = UserAvailabilityModelICal | UserAvailabilityModelGoogleCalendar;

@Schema()
export class UserAvailability {
  @Prop({ type: MSchema.Types.String })
  type: UserAvailabilityModel['type'];

  @Prop()
  uri?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  accessToken?: string;

  @Prop()
  accessTokenExpiration?: Date;

  constructor(userAvailability: UserAvailabilityModel) {
    this.type = userAvailability.type;

    if (userAvailability.type === 'ical') {
      this.uri = userAvailability.uri;
      return;
    }
    if (userAvailability.type === 'googlecalendar') {
      this.refreshToken = userAvailability.refreshToken;
      this.accessToken = userAvailability.accessToken;
      this.accessTokenExpiration = userAvailability.accessTokenExpiration;
      return;
    }
    throw new NeverError(userAvailability);
  }
}

export type UserAvailabilityDocument = UserAvailability & Document;
export const UserAvailabilitySchema = SchemaFactory.createForClass(UserAvailability);
