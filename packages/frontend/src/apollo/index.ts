import { ApolloClient, InMemoryCache } from '@apollo/client';

const SERVER_URI = `${JSON.parse(process.env.SERVER_BASE_URI ?? '{}')}/graphql`;

const client = new ApolloClient({
  uri: SERVER_URI,
  cache: new InMemoryCache(),
});

export default client;
