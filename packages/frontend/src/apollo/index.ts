import { ApolloClient, InMemoryCache } from '@apollo/client';

const SERVER_BASE_URI = process.env.REACT_APP_SERVER_BASE_URI;
if (!SERVER_BASE_URI) {
  throw new ReferenceError('REACT_APP_SERVER_BASE_URI is not defined.');
}

const SERVER_URI = `${SERVER_BASE_URI}/graphql`;

const client = new ApolloClient({
  uri: SERVER_URI,
  cache: new InMemoryCache(),
});

export default client;
