import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document } from 'mongoose';

export type UserSettingsTheme = 'light' | 'dark' | 'system';

export interface UserSettingsModel {
  theme?: UserSettingsTheme;
}

@Schema()
export class UserSettings implements UserSettingsModel {
  @Prop()
  theme?: UserSettingsTheme;

  constructor(userSettings: UserSettingsModel) {
    this.theme = userSettings.theme;
  }
}

export type UserSettingsDocument = UserSettings & Document;
export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
