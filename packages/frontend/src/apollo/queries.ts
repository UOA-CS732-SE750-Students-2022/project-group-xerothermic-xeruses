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
  query GetFlock($flockCode: String!) {
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
  query GetFlock($getFlockId: String!) {
    getFlock(id: $getFlockId) {
      users {
        id
        name
      }
    }
  }
`;

export const GET_USER_CALENDARS = gql`
  query getFlock($getFlockId: String!) {
    getFlock(id: $getFlockId) {
      userFlockAvailability {
        userAvailability {
          id
          type
          name
          uri
          refreshToken
          calendarId
        }
      }
    }
  }
`;
