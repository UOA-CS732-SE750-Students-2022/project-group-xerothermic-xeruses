import { UserSettingsDTO, UserSettingsThemeDTO } from '@flocker/api-types';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

registerEnumType(UserSettingsThemeDTO, {
  name: 'UserSettingsTheme',
});

@ObjectType()
export class UserSettingsGraphQLModel implements UserSettingsDTO {
  @Field(() => UserSettingsThemeDTO, { nullable: true })
  theme?: UserSettingsThemeDTO;
}
