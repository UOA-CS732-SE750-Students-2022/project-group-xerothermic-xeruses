/**
 * Used to represent an interval we wish to know the availability for.
 */
export interface UserIntervalInputDTO {
  start: Date;
  end: Date;
}

/**
 * Represents a users availability for a given date, split into 15 minute intervals from the start hour to the end hour.
 */
export interface UserFlockIntervalDTO {
  start: Date;
  end: Date;
  available: boolean;
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
  id: string;
  available: boolean | undefined;
  manual: boolean;
}

/**
 * Used to return the users availability for all dates.
 */
export interface UserAvailabilityIntervalDTO {
  start: Date;
  end: Date;
  availability: UserIntervalDTO[];
}
