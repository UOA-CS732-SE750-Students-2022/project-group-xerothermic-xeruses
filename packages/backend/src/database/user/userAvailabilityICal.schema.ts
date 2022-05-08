import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, type Types } from 'mongoose';

/**
 * External .ical datasource for user availability.
 */
export const USER_AVAILABILITY_ICAL = 'ical';

/**
 * External .ical datasource for user availability.
 */
export interface UserAvailabilityICal {
  type: typeof USER_AVAILABILITY_ICAL;
  name: string;
  uri: string;
}

@Schema()
class UserAvailabilityICalClass implements UserAvailabilityICal {
  type: typeof USER_AVAILABILITY_ICAL = USER_AVAILABILITY_ICAL;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  uri!: string;
}

/**
 * External .ical datasource for user availability.
 */
export type UserAvailabilityICalDocument = UserAvailabilityICalClass &
  Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * External .ical datasource for user availability.
 */
export const UserAvailabilityICalSchema = SchemaFactory.createForClass(UserAvailabilityICalClass);
