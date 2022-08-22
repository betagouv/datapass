import React from 'react';
import { Login } from '../templates/Login';

type AuthContextType = {
  user: {
    id: number;
    email: string;
    given_name: string;
    family_name: string;
    phone_number: string;
    job: string;
    roles: string[];
    organizations: [
      {
        id: number;
        siret: string;
        is_external: boolean;
      }
    ];
  } | null;
  isLoading: boolean;
  connectionError: string | null;
  login: () => void;
  logout: () => void;
  reset: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
  connectionError: null,
  login: () => {},
  logout: () => {},
  reset: () => {},
});

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const AuthRequired = ({
  children,
}: {
  children: React.ReactNode | null;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return children;
};
