import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import apolloClient from './apollo';
import { AuthProvider } from './contexts/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <StyledEngineProvider injectFirst>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
