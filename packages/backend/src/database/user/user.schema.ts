import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MSchema, type Types } from 'mongoose';
import {
  type UserAvailability,
  UserAvailabilitySchema,
  registerUserAvailabilityDiscriminators,
  UserAvailabilityDocument,
} from './userAvailability.schema';
import { type UserSettings, UserSettingsSchema } from './userSettings.schema';

export const USER_MODEL_NAME = 'User';

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export interface User {
  name: string;
  firebaseId: string;
  flocks: Types.ObjectId[];
  flockInvites: Types.ObjectId[];
  availability: UserAvailability[];
  settings?: UserSettings;
}

@Schema()
class UserClass implements User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  firebaseId!: string;

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', required: true })
  flocks!: Types.ObjectId[];

  @Prop({ type: [MSchema.Types.ObjectId], ref: 'Flock', required: true })
  flockInvites!: Types.ObjectId[];

  @Prop({ type: [UserAvailabilitySchema], required: true })
  availability!: UserAvailabilityDocument[];

  @Prop({ type: UserSettingsSchema, required: false })
  settings?: UserSettings;
}

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export type UserDocument = UserClass & Omit<Document<Types.ObjectId>, 'id'> & { _id: Types.ObjectId };

/**
 * A User represents a single unique person with their Flocks, availability & settings.
 */
export const UserSchema = SchemaFactory.createForClass(UserClass);
registerUserAvailabilityDiscriminators(UserSchema.path('availability'));
