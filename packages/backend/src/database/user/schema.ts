import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { Flock } from '../flock';
import { UserAvailability, UserAvailabilitySchema } from './availability';
import { UserSettings, UserSettingsSchema } from './settings';

export interface UserModel {
  _id: Types.ObjectId;
  name: string;
  flocks: Flock[];
  flockInvites: Flock[];
  availability: UserAvailability[];
  settings?: UserSettings;
}

@Schema()
export class User implements UserModel {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flocks: Flock[];

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flockInvites: Flock[];

  @Prop({ type: [UserAvailabilitySchema], default: [] })
  availability: UserAvailability[];

  @Prop({ type: UserSettingsSchema })
  settings?: UserSettings;

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
