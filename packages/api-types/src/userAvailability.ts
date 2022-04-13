import { MaybeUndefined } from './common';
import type { UserAvailabilityGoogleCalendarDTO } from './userAvailabilityGoogleCalendar';
import type { UserAvailabilityICalDTO } from './userAvailabilityICal';

export type UserAvailabilityDTO = UserAvailabilityGoogleCalendarDTO | UserAvailabilityICalDTO;

// Requires that all attributes from UserAvailability* are present in UserAvailabilityCombined.
type NoType<T> = Omit<T, 'type'>;
export type UserAvailabilityCombinedDTO = { type: string } & NoType<UserAvailabilityGoogleCalendarDTO> &
  NoType<UserAvailabilityICalDTO>;

// Requires that all attributes from UserAvailabilityCombined are present or explicitly undefined in UserAvailabilityPartial.
export type UserAvailabilityPartialDTO = { type: string } & MaybeUndefined<UserAvailabilityCombinedDTO>;
