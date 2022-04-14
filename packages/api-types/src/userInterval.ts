/**
 * Supply information to obtain a users interval availability.
 */
export interface UserIntervalInputDTO {
  startDate: Date;
  endDate: Date;
  startHour: number;
  endHour: number;
}

/**
 * Represents a users availability for a given date, split into 15 minute intervals from the start hour to the end hour.
 */
export interface UserIntervalDTO {
  date: Date;
  intervals: boolean[];
}

/**
 * Used to return the users availability for all dates.
 */
export interface UserAvailabilityIntervalDTO {
  availability: UserIntervalDTO[];
}
