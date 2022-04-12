import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserSettings, UserSettingsTheme } from '~/database/user/userSettings.schema';

registerEnumType(UserSettingsTheme, {
  name: 'UserSettingsTheme',
});

@ObjectType()
export class UserSettingsGraphQLModel implements UserSettings {
  @Field(() => UserSettingsTheme, { nullable: true })
  theme?: UserSettingsTheme;
}
