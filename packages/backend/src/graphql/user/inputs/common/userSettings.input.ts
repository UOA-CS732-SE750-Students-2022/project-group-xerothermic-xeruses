import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UserSettings, UserSettingsTheme } from '~/database/user/userSettings.schema';

registerEnumType(UserSettingsTheme, {
  name: 'UserSettingsTheme',
});

@InputType()
export class UserSettingsInput implements UserSettings {
  @Field(() => UserSettingsTheme, { nullable: true })
  theme?: UserSettingsTheme;
}
