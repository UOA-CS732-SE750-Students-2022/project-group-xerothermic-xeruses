import React, { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../auth/firebase';
import apolloClient, { link } from '../apollo';

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authLoaded: boolean;
  signedIn: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
  authLoaded: false,
  signedIn: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // Persist login state over multiple sessions
  useEffect(() => {
    // Returns function to stop the listener
    const clearListener = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoaded(true);
      apolloClient.setLink(link);
    });

    return clearListener;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoaded,
        signedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
