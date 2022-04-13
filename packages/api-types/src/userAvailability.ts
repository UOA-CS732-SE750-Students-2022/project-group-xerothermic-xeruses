import type { UserAvailabilityGoogleCalendarDTO } from './userAvailabilityGoogleCalendar';
import type { UserAvailabilityICalDTO } from './userAvailabilityICal';

export type UserAvailabilityDTO = UserAvailabilityGoogleCalendarDTO | UserAvailabilityICalDTO;

// Type validation for UserAvailability.
// Requires that all attributes from each type of UserAvailability* are present in UserAvailabilityPartial.
type NoType<T> = { [P in keyof Omit<T, 'type'>]: T[P] | undefined };
export type UserAvailabilityPartialDTO = { type: string } & NoType<UserAvailabilityGoogleCalendarDTO> &
  NoType<UserAvailabilityICalDTO>;
