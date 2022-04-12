import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, type Types } from 'mongoose';

/**
 * Google Calendar datasource for user availability.
 */
export const USER_AVAILABILITY_GOOGLE_CALENDAR = 'googlecalendar';

/**
 * Google Calendar datasource for user availability.
 */
export interface UserAvailabilityGoogleCalendar {
  type: typeof USER_AVAILABILITY_GOOGLE_CALENDAR;
  refreshToken: string;
  accessToken: string;
  accessTokenExpiration: Date;
}

@Schema()
class UserAvailabilityGoogleCalendarClass implements UserAvailabilityGoogleCalendar {
  type: typeof USER_AVAILABILITY_GOOGLE_CALENDAR = USER_AVAILABILITY_GOOGLE_CALENDAR;

  @Prop({ required: true })
  refreshToken!: string;

  @Prop({ required: true })
  accessToken!: string;

  @Prop({ required: true })
  accessTokenExpiration!: Date;
}

/**
 * Google Calendar datasource for user availability.
 */
export type UserAvailabilityGoogleCalendarDocument = UserAvailabilityGoogleCalendarClass &
  Omit<Document<Types.ObjectId>, 'id'>;

/**
 * Google Calendar datasource for user availability.
 */
export const UserAvailabilityGoogleCalendarSchema = SchemaFactory.createForClass(UserAvailabilityGoogleCalendarClass);
