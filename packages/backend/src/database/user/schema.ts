import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { FlockModel } from '../flock';
import { UserAvailabilityModel, UserAvailabilitySchema } from './availability';
import { UserSettingsModel, UserSettingsSchema } from './settings';

export interface UserModel {
  _id: Types.ObjectId;
  name: string;
  flocks: FlockModel[];
  flockInvites: FlockModel[];
  availability: UserAvailabilityModel[];
  settings?: UserSettingsModel;
}

@Schema()
export class User implements UserModel {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flocks: FlockModel[];

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flockInvites: FlockModel[];

  @Prop({ type: [UserAvailabilitySchema], default: [] })
  availability: UserAvailabilityModel[];

  @Prop({ type: UserSettingsSchema })
  settings?: UserSettingsModel;

  constructor(user: UserModel) {
    this._id = user._id;
    this.name = user.name;
    this.flocks = user.flocks;
    this.flockInvites = user.flockInvites;
    this.availability = user.availability;
    this.settings = user.settings;
  }
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
