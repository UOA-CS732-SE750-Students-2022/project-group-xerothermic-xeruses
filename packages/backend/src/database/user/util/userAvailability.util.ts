import { Injectable } from '@nestjs/common';
import { UnreachableError } from '~/UnreachableError';
import { type UserAvailability } from '../userAvailability.schema';
import {
  UserAvailabilityGoogleCalendar,
  USER_AVAILABILITY_GOOGLE_CALENDAR,
} from '../userAvailabilityGoogleCalendar.schema';
import { UserAvailabilityICal, USER_AVAILABILITY_ICAL } from '../userAvailabilityICal.schema';

/**
 * Utility functions for UserAvailability types.
 */
@Injectable()
export class UserAvailabilityUtil {
  isUserAvailability(x: any): x is UserAvailability {
    return this.isUserAvailabilityGoogleCalendar(x) || this.isUserAvailabilityICal(x);
  }

  /**
   * Keeps only the UserAvailability fields in `x`.
   *
   * Also used to set the order of keys in the object, e.g. for `JSON.stringify()` comparisons.
   */
  toUserAvailability(x: UserAvailability): UserAvailability {
    switch (x.type) {
      case USER_AVAILABILITY_GOOGLE_CALENDAR:
        return this.toUserAvailabilityGoogleCalendar(x);
      case USER_AVAILABILITY_ICAL:
        return this.toUserAvailabilityICal(x);
      default:
        throw new UnreachableError(x);
    }
  }

  isUserAvailabilityGoogleCalendar(x: any): x is UserAvailabilityGoogleCalendar {
    return (
      typeof x === 'object' &&
      x.type === USER_AVAILABILITY_GOOGLE_CALENDAR &&
      typeof x.refreshToken === 'string' &&
      typeof x.accessToken === 'string' &&
      x.accessTokenExpiration instanceof Date
    );
  }

  /**
   * Keeps only the UserAvailabilityGoogleCalendar fields in `x`.
   *
   * Also used to set the order of keys in the object, e.g. for `JSON.stringify()` comparisons.
   */
  toUserAvailabilityGoogleCalendar(x: UserAvailabilityGoogleCalendar): UserAvailabilityGoogleCalendar {
    const { type, refreshToken, accessToken, accessTokenExpiration } = x;
    return { type, refreshToken, accessToken, accessTokenExpiration };
  }

  isUserAvailabilityICal(x: any): x is UserAvailabilityICal {
    return typeof x === 'object' && x.type === USER_AVAILABILITY_ICAL && typeof x.uri === 'string';
  }

  /**
   * Keeps only the UserAvailabilityICal fields in `x`.
   *
   * Also used to set the order of keys in the object, e.g. for `JSON.stringify()` comparisons.
   */
  toUserAvailabilityICal(x: UserAvailabilityICal): UserAvailabilityICal {
    const { type, uri } = x;
    return { type, uri };
  }
}
