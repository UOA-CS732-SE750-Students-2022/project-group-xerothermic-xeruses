import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { type Document, Schema as MSchema, type Types } from 'mongoose';

export const FLOCK_MODEL_NAME = 'Flock';

export interface Flock {
  _id: Types.ObjectId;
  name: string;
  users: User[];
}

@Schema()
class FlockClass implements Flock {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'User', default: [] })
  users: User[];

  constructor(flock: Flock) {
    this._id = flock._id;
    this.name = flock.name;
    this.users = flock.users;
  }
}

export type FlockDocument = FlockClass & Document;
export const FlockSchema = SchemaFactory.createForClass(FlockClass);
