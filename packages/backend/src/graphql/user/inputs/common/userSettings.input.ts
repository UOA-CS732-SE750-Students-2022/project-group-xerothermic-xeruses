import { UserSettings, UserSettingsTheme } from '@flocker/api-types';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

registerEnumType(UserSettingsTheme, {
  name: 'UserSettingsTheme',
});

@InputType()
export class UserSettingsInput implements UserSettings {
  @Field(() => UserSettingsTheme, { nullable: true })
  theme?: UserSettingsTheme;
}
