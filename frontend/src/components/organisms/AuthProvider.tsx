import React, { FunctionComponent, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { getErrorMessages } from '../../lib';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

const isProtectedBackendUrl = (url: string): boolean => {
  const { origin, pathname } = new URL(url);

  return origin === BACK_HOST && !pathname.startsWith('/api/stats');
};

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const reset = () => {
    setUser(null);
    setIsLoading(false);
    setConnectionError(null);
  };

  const login = () => {
    setIsLoading(true);

    // Using axios directly for this request as useBackendClient depends on this provider
    axios
      .get(`${process.env.REACT_APP_BACK_HOST}/api/users/me`, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setUser(null);
        setIsLoading(false);
        setConnectionError(getErrorMessages(e).join(' '));
      });
  };

  const logout = () => {
    // MAYBE could reset() then redirect to home page for (marginally) better UX
    // will also empty user from state by reloading the entire app
    window.location.href = `${process.env.REACT_APP_BACK_HOST}/api/users/sign_out`;
  };

  useEffect(() => {
    login();

    // Adds cookies to requests to our backend protected urls
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (config.url && isProtectedBackendUrl(config.url)) {
        config.withCredentials = true;
      }
      return config;
    });

    // Resets auth on 401 error from our backend
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          new URL(error.config.url).origin === BACK_HOST
        ) {
          reset();
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        connectionError,
        login,
        logout,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
