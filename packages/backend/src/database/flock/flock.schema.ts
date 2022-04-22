import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';

export const FLOCK_MODEL_NAME = 'Flock';

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export interface Flock {
  name: string;
  startDate: Date;
  endDate: Date;
  startHour: number;
  endHour: number;
  flockCode: string;
  users: Types.ObjectId[];
}

@Schema()
class FlockClass implements Flock {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ required: true })
  startHour!: number;

  @Prop({ required: true })
  endHour!: number;

  @Prop({ required: true })
  flockCode!: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'User', required: true })
  users!: Types.ObjectId[];
}

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export type FlockDocument = Flock & Omit<Document<Types.ObjectId>, 'id'>;

/**
 * A Flock represents a multi-user ('flock') availability schedule.
 */
export const FlockSchema = SchemaFactory.createForClass(FlockClass);
