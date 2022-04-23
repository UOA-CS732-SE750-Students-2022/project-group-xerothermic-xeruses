import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, type Types } from 'mongoose';
/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface FlockDay {
  start: Date;
  end: Date;
}

@Schema()
class FlockDayClass implements FlockDay {
  @Prop({ required: true })
  start!: Date;

  @Prop({ required: true })
  end!: Date;
}

/**
 * A FlockDay represents a day we want to potentially set a meeting on.
 */
export type FlockDayDocument = FlockDay & Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * A FlockDay represents a day we want to potentially set a meeting on.
 */
export const FlockDaySchema = SchemaFactory.createForClass(FlockDayClass);
