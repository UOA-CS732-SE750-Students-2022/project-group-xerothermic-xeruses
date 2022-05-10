import React from 'react';
import { signOut } from './firebase';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BeforeFirstLoadView from '../views/BeforeFirstLoadView';

const SignOut: React.FC = () => {
  const { signedIn } = useAuth();
  signOut();

  // Wait until user is signed out before redirecting to the home page
  if (signedIn) return <BeforeFirstLoadView />;
  return <Navigate to="/" />;
};

export default SignOut;
