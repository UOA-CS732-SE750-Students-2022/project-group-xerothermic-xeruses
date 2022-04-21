/**
 * Used to represent an interval we wish to know the availability for.
 */
export interface UserInterval {
  start: Date;
  end: Date;
}

/**
 * Record a users interval availability.
 */
export interface UserAvailabilityInterval {
  start: Date;
  end: Date;
  available: boolean;
}
