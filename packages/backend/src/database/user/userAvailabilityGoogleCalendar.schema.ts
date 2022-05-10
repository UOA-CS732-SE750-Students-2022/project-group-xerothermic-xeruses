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
  name: string;
  refreshToken: string;
  calendarId: string;
}

@Schema()
class UserAvailabilityGoogleCalendarClass implements UserAvailabilityGoogleCalendar {
  type: typeof USER_AVAILABILITY_GOOGLE_CALENDAR = USER_AVAILABILITY_GOOGLE_CALENDAR;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  refreshToken!: string;

  @Prop({ required: true })
  calendarId!: string;
}

/**
 * Google Calendar datasource for user availability.
 */
export type UserAvailabilityGoogleCalendarDocument = UserAvailabilityGoogleCalendarClass &
  Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * Google Calendar datasource for user availability.
 */
export const UserAvailabilityGoogleCalendarSchema = SchemaFactory.createForClass(UserAvailabilityGoogleCalendarClass);
