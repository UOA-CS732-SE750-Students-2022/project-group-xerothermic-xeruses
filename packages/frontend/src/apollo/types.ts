import { AddFlockInputDTO, FlockDTO, UserAvailabilityDTO, UserDTO, UserIntervalDTO } from '@flocker/api-types';

// Results
export type GetCurrentUserResult = { getCurrentUser: UserDTO };
export type AddFlockResult = { addFlock: FlockDTO };
export type JoinFlockResult = { joinFlock: { flockCode: string } };
export type GetCurrentFlockResult = { getFlockByCode: FlockDTO };
export type GetFlockParticipantResult = { getParticipants: FlockDTO };
export type GetCurrentUserFlocksResult = { getCurrentUser: FlockDTO };
export type GetUserIntervalsResult = { getUserIntervals: UserIntervalDTO[] };

// Inputs
export type AddFlockInput = { addFlockInput: AddFlockInputDTO };
export type JoinFlockInput = { flockCode: string };
