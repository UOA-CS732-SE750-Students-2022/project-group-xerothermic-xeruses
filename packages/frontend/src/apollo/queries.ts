import { gql } from '@apollo/client';

// Add queries in this file so that it doesn't clutter up our component files

const GET_CURRENT_USER_NAME = gql`
  query Query {
    getCurrentUser {
      name
    }
  }
`;

const CREATE_NEW_USER = gql`
  mutation Mutation($addUserInput: AddUserInput!) {
    addUser(addUserInput: $addUserInput) {
      name
    }
  }
`;

export { GET_CURRENT_USER_NAME, CREATE_NEW_USER };
