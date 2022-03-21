import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';

export interface UserAvailabilityGoogleCalendar {
  type: 'googlecalendar';
  refreshToken: string;
  accessToken: string;
  accessTokenExpiration: Date;
}

export interface UserAvailabilityICal {
  type: 'ical';
  uri: string;
}

export type UserAvailability = UserAvailabilityGoogleCalendar | UserAvailabilityICal;

// Type validation for UserAvailabilityClass.
// Requires that all attributes from each type of UserAvailability* are present in UserAvailabilityClass.
type NoType<T> = { [P in keyof Omit<T, 'type'>]: T[P] | undefined };
type UserAvailabilityClassT = { type: string } & NoType<UserAvailabilityGoogleCalendar> & NoType<UserAvailabilityICal>;

@Schema()
class UserAvailabilityClass implements UserAvailabilityClassT {
  type!: string;

  @Prop({ type: MSchema.Types.String })
  uri: string | undefined;

  @Prop({ type: MSchema.Types.String })
  refreshToken: string | undefined;

  @Prop({ type: MSchema.Types.String })
  accessToken: string | undefined;

  @Prop({ type: MSchema.Types.Date })
  accessTokenExpiration: Date | undefined;
}

export type UserAvailabilityDocument = UserAvailability & Omit<Document<Types.ObjectId>, 'id'>;
export const UserAvailabilitySchema = SchemaFactory.createForClass(UserAvailabilityClass);
