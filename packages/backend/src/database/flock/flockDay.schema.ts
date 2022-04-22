import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, type Types } from 'mongoose';
/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface FlockDay {
  start: string;
  end: string;
}

@Schema()
class FlockDayClass implements FlockDay {
  @Prop({ required: true })
  start!: string;

  @Prop({ required: true })
  end!: string;
}

/**
 * A FlockDay represents a day we want to potentially set a meeting on.
 */
export type FlockDayDocument = FlockDay & Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * A FlockDay represents a day we want to potentially set a meeting on.
 */
export const FlockDaySchema = SchemaFactory.createForClass(FlockDayClass);
