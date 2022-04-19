import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import apolloClient from './apollo';
import { ApolloProvider } from '@apollo/client';
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
