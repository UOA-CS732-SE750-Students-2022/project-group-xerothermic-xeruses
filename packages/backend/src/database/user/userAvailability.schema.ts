import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';
import {
  UserAvailabilityGoogleCalendar,
  UserAvailabilityGoogleCalendarSchema,
  USER_AVAILABILITY_GOOGLE_CALENDAR,
} from './userAvailabilityGoogleCalendar.schema';
import {
  UserAvailabilityICal,
  UserAvailabilityICalSchema,
  USER_AVAILABILITY_ICAL,
} from './userAvailabilityICal.schema';

const userAvailabilityDiscriminators: Record<string, MSchema<Document>> = {
  [USER_AVAILABILITY_GOOGLE_CALENDAR]: UserAvailabilityGoogleCalendarSchema,
  [USER_AVAILABILITY_ICAL]: UserAvailabilityICalSchema,
};

/**
 * This function must be called to register discriminators for each array of UserAvailability.
 */
export function registerUserAvailabilityDiscriminators(array: MSchema.Types.DocumentArray): void {
  Object.entries(userAvailabilityDiscriminators).forEach(([key, schema]) => array.discriminator(key, schema));
}

/**
 * UserAvailability is a datasource for a user availability schedule.
 */
export type UserAvailability = UserAvailabilityGoogleCalendar | UserAvailabilityICal;

// Type validation for UserAvailability.
// Requires that all attributes from each type of UserAvailability* are present in UserAvailabilityPartial.
type NoType<T> = { [P in keyof Omit<T, 'type'>]: T[P] | undefined };
export type UserAvailabilityPartial = { type: string } & NoType<UserAvailabilityGoogleCalendar> &
  NoType<UserAvailabilityICal>;

@Schema({ discriminatorKey: 'type' })
class UserAvailabilityClass /* implements UserAvailability */ {
  @Prop({ type: String, required: true, enum: Object.keys(userAvailabilityDiscriminators) })
  type!: string;
}

/**
 * UserAvailability is a datasource for a user availability schedule.
 */
export type UserAvailabilityDocument = UserAvailability &
  Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * UserAvailability is a datasource for a user availability schedule.
 */
export const UserAvailabilitySchema = SchemaFactory.createForClass(UserAvailabilityClass);
