import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';
import { type UserAvailability, UserAvailabilitySchema } from './userAvailability.schema';
import { type UserSettings, UserSettingsSchema } from './userSettings.schema';

export const USER_MODEL_NAME = 'User';

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export interface User {
  name: string;
  flocks: Types.ObjectId[];
  flockInvites: Types.ObjectId[];
  availability: UserAvailability[];
  settings?: UserSettings;
}

@Schema()
class UserClass implements User {
  @Prop()
  name!: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flocks!: Types.ObjectId[];

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', default: [] })
  flockInvites!: Types.ObjectId[];

  @Prop({ type: [UserAvailabilitySchema], default: [] })
  availability!: UserAvailability[];

  @Prop({ type: UserSettingsSchema })
  settings?: UserSettings;
}

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export type UserDocument = User & Omit<Document<Types.ObjectId>, 'id'>;

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export const UserSchema = SchemaFactory.createForClass(UserClass);
