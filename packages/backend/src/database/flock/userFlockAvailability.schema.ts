import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';

/**
 * UserFlockAvailability is used to indicate if a users calendar is enabled for a flock.
 */
export interface UserFlockAvailability {
  user: Types.ObjectId;
  userAvailability: Types.ObjectId;
  enabled: boolean;
}

@Schema()
class UserFlockAvailabilityClass implements UserFlockAvailability {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'UserAvailability', required: true })
  user!: Types.ObjectId;

  @Prop({ type: MSchema.Types.ObjectId, ref: 'UserAvailability', required: true })
  userAvailability!: Types.ObjectId;

  @Prop({ required: true })
  enabled!: boolean;
}

/**
 * UserFlockAvailability is used to indicate if a users calendar is enabled for a flock.
 */
export type UserFlockAvailabilityDocument = UserFlockAvailability &
  Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * UserFlockAvailability is used to indicate if a users calendar is enabled for a flock.
 */
export const UserFlockAvailabilitySchema = SchemaFactory.createForClass(UserFlockAvailabilityClass);
