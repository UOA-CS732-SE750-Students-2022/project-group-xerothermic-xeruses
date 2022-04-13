import { UserSettings, UserSettingsTheme } from '@flocker/api-types';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

registerEnumType(UserSettingsTheme, {
  name: 'UserSettingsTheme',
});

@ObjectType()
export class UserSettingsGraphQLModel implements UserSettings {
  @Field(() => UserSettingsTheme, { nullable: true })
  theme?: UserSettingsTheme;
}
