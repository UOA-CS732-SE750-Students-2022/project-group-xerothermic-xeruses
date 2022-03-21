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

  /** Access token expiration, in _seconds_ since Epoch. */
  accessTokenExpiration: number;
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
  accessTokenExpiration?: number;

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

  toModel() {
    return this as UserAvailabilityModel;
  }
}

export type UserAvailabilityDocument = UserAvailability & Document;
export const UserAvailabilitySchema = SchemaFactory.createForClass(UserAvailability);
