import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import type { UserModel } from '../user';

export const FLOCK_MODEL_NAME = 'Flock';

export interface FlockModel {
  _id: Types.ObjectId;
  name: string;
  users: UserModel[];
}

@Schema()
class FlockClass implements FlockModel {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'User', default: [] })
  users: UserModel[];

  constructor(flock: FlockModel) {
    this._id = flock._id;
    this.name = flock.name;
    this.users = flock.users;
  }
}

export type FlockDocument = FlockClass & Document;
export const FlockSchema = SchemaFactory.createForClass(FlockClass);
