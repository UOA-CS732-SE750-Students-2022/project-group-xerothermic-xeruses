import { Field, ObjectType } from '@nestjs/graphql';
import { UserSettings, UserSettingsTheme } from '~/database/user/userSettings.schema';

@ObjectType()
export class UserSettingsGraphQLModel implements UserSettings {
  @Field({ nullable: false })
  theme!: UserSettingsTheme;
}
