/**
 * Supply information to obtain a users interval availability.
 */
export interface UserIntervalInputDTO {
  startDate: Date;
  endDate: Date;
  availabilityStartHour: number;
  availabilityEndHour: number;
}

/**
 * Represents a users availability for a given date, split into 15 minute intervals
 */
export interface UserIntervalDTO {
  date: Date;
  availability: boolean[];
}

/**
 * Used to return the users availability for all dates
 */
export interface UserAvailabilityIntervalDTO {
  intervals: UserIntervalDTO[];
}
