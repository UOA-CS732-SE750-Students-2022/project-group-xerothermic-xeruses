/**
 * Used to represent an interval we wish to know the availability for.
 */
export interface UserIntervalInputDTO {
  start: Date;
  end: Date;
}

/**
 * Supply information to obtain a users interval availability.
 */
export interface UserAvailabilityIntervalInputDTO {
  intervals: UserIntervalInputDTO[];
}

/**
 * Represents a users availability for a given date, split into 15 minute intervals from the start hour to the end hour.
 */
export interface UserIntervalDTO {
  start: Date;
  end: Date;
  available: boolean;
}

/**
 * Used to return the users availability for all dates.
 */
export interface UserAvailabilityIntervalDTO {
  availability: UserIntervalDTO[];
}
