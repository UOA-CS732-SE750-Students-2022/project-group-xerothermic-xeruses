import { gql } from '@apollo/client';

// Add queries in this file so that it doesn't clutter up our component files
const GET_USER_INTERVALS = gql`
  query UserIntervals($availabilityIds: [String!]!, $userIntervalInput: UserAvailabilityIntervalInput!) {
    getUserIntervals(availabilityIds: $availabilityIds, userIntervalInput: $userIntervalInput) {
      availability {
        start
        end
        available
      }
    }
  }
`;

export { GET_USER_INTERVALS };
