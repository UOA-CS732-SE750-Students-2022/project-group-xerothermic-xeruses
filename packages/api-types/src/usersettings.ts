/**
 * UserSettingsThemeDTO specifies the theming for the web interface.
 */
export enum UserSettingsThemeDTO {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

/**
 * UserSettingsDTO contains preferences for a single user.
 */
export interface UserSettingsDTO {
  theme?: UserSettingsThemeDTO;
}
