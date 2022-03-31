import { ApolloClient, InMemoryCache } from '@apollo/client';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
if (!SERVER_URI) {
  throw new ReferenceError('REACT_APP_SERVER_URI is not defined.');
}

const client = new ApolloClient({
  uri: SERVER_URI,
  cache: new InMemoryCache(),
});

export default client;
