import React from 'react';
import { createContext, useContext, useState } from 'react';
import { User } from 'firebase/auth';

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
