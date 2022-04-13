import type { UserAvailabilityGoogleCalendar } from './useravailabilitygooglecalendar';
import type { UserAvailabilityICal } from './useravailabilityical';

export type UserAvailability = UserAvailabilityGoogleCalendar | UserAvailabilityICal;

// Type validation for UserAvailability.
// Requires that all attributes from each type of UserAvailability* are present in UserAvailabilityPartial.
type NoType<T> = { [P in keyof Omit<T, 'type'>]: T[P] | undefined };
export type UserAvailabilityPartial = { type: string } & NoType<UserAvailabilityGoogleCalendar> &
  NoType<UserAvailabilityICal>;
