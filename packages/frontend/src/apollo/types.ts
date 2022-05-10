import { AddFlockInputDTO, FlockDTO, UserDTO } from '@flocker/api-types';

// Results
export type GetCurrentUserResult = { getCurrentUser: UserDTO };
export type AddFlockResult = { addFlock: FlockDTO };
export type JoinFlockResult = { joinFlock: { flockCode: string } };
export type GetCurrentFlockResult = { getFlock: FlockDTO };
export type GetFlockParticipantResult = { getParticipants: FlockDTO };
export type GetCurrentUserCalendarsResult = { getUserFlockAvailability: FlockDTO };

// Inputs
export type AddFlockInput = { addFlockInput: AddFlockInputDTO };
export type JoinFlockInput = { flockCode: string };
