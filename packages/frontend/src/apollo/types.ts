import {
  AddFlockInputDTO,
  FlockAvailabilityDTO,
  FlockDTO,
  UserAvailabilityDTO,
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
export type AddiCalResult = { availability: UserAvailabilityDTO };
export type LeaveFlockResult = { leaveFlock: UserDTO };
export type AddManualAvailabilityResult = {};

// Inputs
export type AddFlockInput = { addFlockInput: AddFlockInputDTO };
export type JoinFlockInput = { flockCode: string };
export type GetFlockInput = { flockCode: string };
export type UpdateCalendarEnablementInput = {
  flockCode: string;
  userFlockAvailabilityInput: UserFlockAvailabilityInputDTO;
};
export type AddiCalInput = { userAvailabilitySources: { type: string; name: string; uri: string }[] };
export type LeaveFlockInput = { flockCode: string };
export type AddManualAvailability = {
  flockCode: string;
  manualAvailabilityIntervalInput: { intervals: { start: Date; end: Date; available: boolean }[] };
};
