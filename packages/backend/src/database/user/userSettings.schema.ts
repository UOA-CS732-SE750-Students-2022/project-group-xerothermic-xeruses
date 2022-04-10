import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, type Types } from 'mongoose';

/**
 * UserSettingsTheme specifies the theming for the web interface.
 */
export enum UserSettingsTheme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

/**
 * UserSettings is an embedded document containing preferences for a single user.
 */
export interface UserSettings {
  theme?: UserSettingsTheme;
}

@Schema()
class UserSettingsClass implements UserSettings {
  @Prop({ required: false })
  theme?: UserSettingsTheme;
}

/**
 * UserSettings is an embedded document containing preferences for a single user.
 */
export type UserSettingsDocument = UserSettings & Omit<Document<Types.ObjectId>, 'id'>;

/**
 * UserSettings is an embedded document containing preferences for a single user.
 */
export const UserSettingsSchema = SchemaFactory.createForClass(UserSettingsClass);
