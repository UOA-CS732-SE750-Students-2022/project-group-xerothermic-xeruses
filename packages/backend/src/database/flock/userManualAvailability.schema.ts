import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';
import { ManualAvailability, ManualAvailabilityDocument, ManualAvailabilitySchema } from './manualAvailability.schema';

/**
 * UserManualAvailability is used to indicate extra times when a user is available or not for a flock.
 */
export interface UserManualAvailability {
  user: Types.ObjectId;
  intervals: ManualAvailability[];
}

@Schema()
class UserManualAvailabilityClass implements UserManualAvailability {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ type: [ManualAvailabilitySchema], required: true })
  intervals!: ManualAvailabilityDocument[];
}

/**
 * UserManualAvailability is used to indicate extra times when a user is available or not for a flock.
 */
export type UserManualAvailabilityDocument = UserManualAvailabilityClass &
  Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * UserManualAvailability is used to indicate extra times when a user available or not for a flock.
 */
export const UserManualAvailabilitySchema = SchemaFactory.createForClass(UserManualAvailabilityClass);
