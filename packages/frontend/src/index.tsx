import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import apolloClient from './apollo';
import Routes from './routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <StyledEngineProvider injectFirst>
        <AuthProvider>
          <BrowserRouter>
            <Routes></Routes>
          </BrowserRouter>
        </AuthProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
