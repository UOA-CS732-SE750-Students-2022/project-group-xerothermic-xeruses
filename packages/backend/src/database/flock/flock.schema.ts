import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';
import { FlockDay } from './flockDay.schema';
import {
  UserFlockAvailability,
  UserFlockAvailabilityDocument,
  UserFlockAvailabilitySchema,
} from './userFlockAvailability.schema';
import { UserManualAvailabilityDocument, UserManualAvailabilitySchema } from './userManualAvailability.schema';

export const FLOCK_MODEL_NAME = 'Flock';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface Flock {
  name: string;
  flockDays: FlockDay[];
  flockCode: string;
  users: Types.ObjectId[];
  userFlockAvailability: UserFlockAvailability[];
  userManualAvailability: UserManualAvailabilityDocument[];
}

@Schema()
class FlockClass implements Flock {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  flockDays!: FlockDay[];

  @Prop({ unique: true, required: true })
  flockCode!: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'User', required: true })
  users!: Types.ObjectId[];

  @Prop({ type: [UserFlockAvailabilitySchema], required: true })
  userFlockAvailability!: UserFlockAvailabilityDocument[];

  @Prop({ type: [UserManualAvailabilitySchema], required: true })
  userManualAvailability!: UserManualAvailabilityDocument[];
}

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export type FlockDocument = FlockClass & Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export const FlockSchema = SchemaFactory.createForClass(FlockClass);
