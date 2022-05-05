import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { useApolloClient } from '.';

/**
 * Wrapper around the ApolloProvider so that it performs relevant resets
 * when the authenticated user changes.
 */
const FlockerApolloProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const client = useApolloClient(user);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default FlockerApolloProvider;
