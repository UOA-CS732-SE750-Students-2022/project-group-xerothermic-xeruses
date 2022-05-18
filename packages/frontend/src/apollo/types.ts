import {
  AddFlockInputDTO,
  FlockAvailabilityDTO,
  FlockDTO,
  UserAvailabilityIntervalDTO,
  UserDTO,
  UserFlockAvailabilityInputDTO,
} from '@flocker/api-types';

// Results
export type GetCurrentUserResult = { getCurrentUser: UserDTO };
export type AddFlockResult = { addFlock: FlockDTO };
export type JoinFlockResult = { joinFlock: { flockCode: string } };
export type GetCurrentFlockResult = { getFlockByCode: FlockDTO };
export type GetUserIntervalsResult = { getUserIntervals: UserAvailabilityIntervalDTO };
export type GetFlockIntervalsResult = { getUserIntervalsForFlock: FlockAvailabilityDTO };
export type GoogleCalendarAuthUrlResult = { googleCalendarAuthUrl: string };
export type UpdateCalendarEnablementResult = { updateAvailabilityEnablement: FlockDTO };

// Inputs
export type AddFlockInput = { addFlockInput: AddFlockInputDTO };
export type JoinFlockInput = { flockCode: string };
export type UpdateCalendarEnablementInput = {
  updateAvailabilityEnablement: { flockCode: string; userFlockAvailabilityInput: UserFlockAvailabilityInputDTO };
};
