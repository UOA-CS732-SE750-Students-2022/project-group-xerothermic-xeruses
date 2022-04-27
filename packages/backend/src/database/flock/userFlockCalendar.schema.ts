import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface UserFlockCalendar {
  userCalendar: Types.ObjectId;
  enabled: boolean;
}

@Schema()
class UserFlockCalendarClass implements UserFlockCalendar {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'UserAvailability', required: true })
  userCalendar!: Types.ObjectId;

  @Prop({ required: true })
  enabled!: boolean;
}

/**
 * A FlockDay represents a day we want to potentially set a meeting on.
 */
export type UserFlockCalendarDocument = UserFlockCalendar &
  Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * A FlockDay represents a day we want to potentially set a meeting on.
 */
export const UserFlockCalendarSchema = SchemaFactory.createForClass(UserFlockCalendarClass);
