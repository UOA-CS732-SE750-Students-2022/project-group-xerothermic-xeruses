import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import FlockerApolloProvider from './provider';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
if (!SERVER_URI) {
  throw new ReferenceError('REACT_APP_SERVER_URI is not defined.');
}

/**
 * Gets the link for the auth header of graphql queries so that users can
 * make authenticated queries.
 */
const getAuthLink = (user: User | null) =>
  setContext(async (_, { headers }) => {
    const token = await user?.getIdToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

/**
 * The link for the endpoint where graphql queries are made.
 */
const httpLink = new HttpLink({
  uri: SERVER_URI,
});

/**
 * Gets the Apollo client to be used for the Apollo provider. Enables graphql
 * queries to be made to the backend.
 *
 * @param user the user which is logged in. Required for authenticated queries
 * @returns the Apollo client
 */
export const useApolloClient = (user: User | null) => {
  const [client] = useState(new ApolloClient({ cache: new InMemoryCache() }));

  // If the user changes, reset the authorization header, and clear the cache
  // so that queries can be rerun on the new user.
  useEffect(() => {
    const link = getAuthLink(user).concat(httpLink);
    client.setLink(link); // Reset auth header
    client.resetStore(); // Clear cache (and rerun active queries)
  }, [user, client]);

  return client;
};

export { FlockerApolloProvider };
export * from './types';
export * from './queries';
