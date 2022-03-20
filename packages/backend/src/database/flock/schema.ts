import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import type { User } from '../user';

export interface FlockModel {
  _id: Types.ObjectId;
  name: string;
  users: User[];
}

@Schema()
export class Flock implements FlockModel {
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

export type FlockDocument = Flock & Document;
export const FlockSchema = SchemaFactory.createForClass(Flock);
