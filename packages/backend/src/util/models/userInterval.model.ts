/**
 * Used to represent an interval we wish to know the availability for.
 */
export interface Interval {
  start: Date;
  end: Date;
}

/**
 * Record a interval availability.
 */
export interface AvailabilityInterval {
  start: Date;
  end: Date;
  available: boolean | null;
}
