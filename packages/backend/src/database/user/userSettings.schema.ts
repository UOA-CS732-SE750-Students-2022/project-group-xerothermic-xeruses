import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, type Types } from 'mongoose';

export type UserSettingsTheme = 'light' | 'dark' | 'system';

export interface UserSettings {
  theme?: UserSettingsTheme;
}

@Schema()
class UserSettingsClass implements UserSettings {
  @Prop()
  theme?: UserSettingsTheme;
}

export type UserSettingsDocument = UserSettings & Omit<Document<Types.ObjectId>, 'id'>;
export const UserSettingsSchema = SchemaFactory.createForClass(UserSettingsClass);
