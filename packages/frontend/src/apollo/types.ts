import {
  AddFlockInputDTO,
  FlockAvailabilityDTO,
  FlockDTO,
  UserAvailabilityIntervalDTO,
  UserDTO,
} from '@flocker/api-types';

// Results
export type GetCurrentUserResult = { getCurrentUser: UserDTO };
export type AddFlockResult = { addFlock: FlockDTO };
export type JoinFlockResult = { joinFlock: { flockCode: string } };
export type GetCurrentFlockResult = { getFlockByCode: FlockDTO };
export type GetUserIntervalsResult = { getUserIntervals: UserAvailabilityIntervalDTO };
export type GetFlockIntervalsResult = { getUserIntervalsForFlock: FlockAvailabilityDTO };
export type GoogleCalendarAuthUrlResult = { googleCalendarAuthUrl: string };

// Inputs
export type AddFlockInput = { addFlockInput: AddFlockInputDTO };
export type JoinFlockInput = { flockCode: string };
