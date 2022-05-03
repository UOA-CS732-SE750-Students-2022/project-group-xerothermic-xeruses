import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { auth } from '../auth/firebase';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
if (!SERVER_URI) {
  throw new ReferenceError('REACT_APP_SERVER_URI is not defined.');
}

const authLink = setContext(async (_, { headers }) => {
  const user = auth.currentUser;
  const token = await user?.getIdToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = new HttpLink({
  uri: SERVER_URI,
});

export const link = authLink.concat(httpLink);

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

export default client;
