/**
 * Used to represent an interval we wish to know the availability for.
 */
export interface FlockIntervalInputDTO {
  start: Date;
  end: Date;
}

/**
 * Supply information to obtain interval availability for every user except the current user in a flock.
 */
export interface FlockAvailabilityIntervalInputDTO {
  intervals: FlockIntervalInputDTO[];
}

/**
 * Supply information to obtain a flocks interval availability.
 */
export interface FlockAvailabilityDTO {
  availabilities: FlockAvailabilityIntervalDTO[];
}

/**
 * Used to return each users availability for all dates.
 */
export interface FlockAvailabilityIntervalDTO {
  userId: string;
  intervals: FlockIntervalDTO[];
}

/**
 * Represents a users availability for a given time period.
 */
export interface FlockIntervalDTO {
  start: Date;
  end: Date;
  available: boolean;
}
