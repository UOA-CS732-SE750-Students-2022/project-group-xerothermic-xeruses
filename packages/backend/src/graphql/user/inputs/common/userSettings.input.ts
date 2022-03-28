import { Field, InputType } from '@nestjs/graphql';
import { UserSettings, UserSettingsTheme } from '~/database/user/userSettings.schema';

@InputType()
export class UserSettingsInput implements UserSettings {
  @Field({ nullable: false })
  theme!: UserSettingsTheme;
}
