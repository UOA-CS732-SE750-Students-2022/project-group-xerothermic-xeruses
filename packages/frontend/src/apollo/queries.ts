import { gql } from '@apollo/client';

// Add queries in this file so that it doesn't clutter up our component files

export const GET_CURRENT_USER_NAME = gql`
  query Query {
    getCurrentUser {
      name
    }
  }
`;

export const CREATE_NEW_USER = gql`
  mutation Mutation($addUserInput: AddUserInput!) {
    addUser(addUserInput: $addUserInput) {
      name
    }
  }
`;

export const GET_USER_FLOCKS = gql`
  query Flocks {
    getCurrentUser {
      flocks {
        name
        flockCode
        flockDays {
          start
          end
        }
        users {
          id
        }
      }
    }
  }
`;

export const CREATE_FLOCK = gql`
  mutation Mutation($addFlockInput: AddFlockInput!) {
    addFlock(addFlockInput: $addFlockInput) {
      flockCode
    }
  }
`;

export const JOIN_FLOCK = gql`
  mutation JoinFlock($flockCode: String!) {
    joinFlock(flockCode: $flockCode) {
      flockCode
    }
  }
`;

export const GET_USER_FLOCK = gql`
  query GetFlockByCode($flockCode: String!) {
    getFlockByCode(flockCode: $flockCode) {
      name
      flockDays {
        start
        end
      }
      userFlockAvailability {
        userAvailability {
          id
          name
          calendarId
        }
      }
    }
  }
`;

export const GET_FLOCK_PARTICIPANTS = gql`
  query GetFlockByCode($flockCode: String!) {
    getFlockByCode(flockCode: $flockCode) {
      users {
        id
        name
      }
    }
  }
`;

export const GET_USER_CALENDARS = gql`
  query GetCurrentUser {
    getCurrentUser {
      availability {
        id
        type
        name
        uri
        refreshToken
        calendarId
      }
      flocks {
        flockCode
        userFlockAvailability {
          userAvailability {
            id
          }
          enabled
        }
      }
    }
  }
`;

export const GET_USER_INTERVALS = gql`
  query GetUserIntervals(
    $availabilityIds: [String!]!
    $flockCode: [String!]!
    $userIntervalInput: UserAvailabilityIntervalInput!
  ) {
    getUserIntervals(availabilityIds: $availabilityIds, flockCode: $flockCode, userIntervalInput: $userIntervalInput) {
      availability {
        start
        end
        available
      }
    }
  }
`;

export const GET_FLOCK_INTERVALS = gql`
  query GetUserIntervalsForFlock(
    $flockCode: String!
    $flockAvailabilityIntervalInput: FlockAvailabilityIntervalInput!
  ) {
    getUserIntervalsForFlock(flockCode: $flockCode, flockAvailabilityIntervalInput: $flockAvailabilityIntervalInput) {
      availabilities {
        intervals {
          start
          end
          available
        }
      }
    }
  }
`;

export const UPDATE_CALENDAR_ENABLEMENT = gql`
  mutation Mutation($flockCode: String!, $userFlockAvailabilityInput: UserFlockAvailabilityInput!) {
    updateAvailabilityEnablement(flockCode: $flockCode, userFlockAvailabilityInput: $userFlockAvailabilityInput) {
      flockCode
    }
  }
`;

export const GET_GOOGLE_CALENDAR_AUTH_URL = gql`
  query Query {
    googleCalendarAuthUrl
  }
`;
