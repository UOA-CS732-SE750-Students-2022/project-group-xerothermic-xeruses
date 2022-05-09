import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FlockerApolloProvider } from './apollo';
import { StyledEngineProvider } from '@mui/material/styles';

const App = ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <FlockerApolloProvider>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <Routes></Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </FlockerApolloProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

export default App;
