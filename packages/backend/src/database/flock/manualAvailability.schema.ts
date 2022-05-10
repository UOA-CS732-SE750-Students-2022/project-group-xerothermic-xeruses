import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, type Types } from 'mongoose';

/**
 * ManualAvailability is used to indicate a particular interval when a user is not available for a flock.
 */
export interface ManualAvailability {
  start: Date;
  end: Date;
}

@Schema()
class ManualAvailabilityClass implements ManualAvailability {
  @Prop({ required: true })
  start!: Date;

  @Prop({ required: true })
  end!: Date;
}

/**
 * ManualAvailability is used to indicate a particular interval when a user is not available for a flock.
 */
export type ManualAvailabilityDocument = ManualAvailability &
  Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * ManualAvailability is used to indicate a particular interval when a user is not available for a flock.
 */
export const ManualAvailabilitySchema = SchemaFactory.createForClass(ManualAvailabilityClass);
