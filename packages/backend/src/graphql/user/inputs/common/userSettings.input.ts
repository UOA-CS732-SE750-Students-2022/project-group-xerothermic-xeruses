import { UserSettingsDTO, UserSettingsThemeDTO } from '@flocker/api-types';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

registerEnumType(UserSettingsThemeDTO, {
  name: 'UserSettingsTheme',
});

@InputType()
export class UserSettingsInput implements Partial<UserSettingsDTO> {
  @Field(() => UserSettingsThemeDTO, { nullable: true })
  theme?: UserSettingsThemeDTO;
}
