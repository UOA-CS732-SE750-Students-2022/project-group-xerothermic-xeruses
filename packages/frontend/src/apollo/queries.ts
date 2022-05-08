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
