/**
 * UserSettingsTheme specifies the theming for the web interface.
 */
export enum UserSettingsTheme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

/**
 * UserSettings is an embedded document containing preferences for a single user.
 */
export interface UserSettings {
  theme?: UserSettingsTheme;
}
