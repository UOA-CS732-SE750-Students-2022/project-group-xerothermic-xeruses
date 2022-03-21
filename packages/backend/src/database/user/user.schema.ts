import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { Flock } from '../flock/flock.schema';
import { UserAvailabilityModel, UserAvailabilitySchema } from './userAvailability.schema';
import { UserSettingsModel, UserSettingsSchema } from './userSettings.schema';

export const USER_MODEL_NAME = 'User';

export interface User {
  _id: Types.ObjectId;
  name: string;
  flocks: Flock[];
  flockInvites: Flock[];
  availability: UserAvailabilityModel[];
  settings?: UserSettingsModel;
}

@Schema()
class UserClass implements User {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flocks: Flock[];

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flockInvites: Flock[];

  @Prop({ type: [UserAvailabilitySchema], default: [] })
  availability: UserAvailabilityModel[];

  @Prop({ type: UserSettingsSchema })
  settings?: UserSettingsModel;

  constructor(user: User) {
    this._id = user._id;
    this.name = user.name;
    this.flocks = user.flocks;
    this.flockInvites = user.flockInvites;
    this.availability = user.availability;
    this.settings = user.settings;
  }
}

export type UserDocument = UserClass & Document;
export const UserSchema = SchemaFactory.createForClass(UserClass);
