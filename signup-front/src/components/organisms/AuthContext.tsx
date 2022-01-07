import React from 'react';
import httpClient from '../../lib/http-client';
import { getErrorMessages } from '../../lib';
import { Login } from '../templates/Login';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

type AuthContextType = {
  user: any;
  isLoading: boolean;
  connectionError: string | null;
  login: () => void;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextType>(null!);

export const useAuth = () => {
  return React.useContext(AuthContext);
};

/**
 * Do not try this at home: trying to modify a state of a component outside react is not recommended!
 * We needed a convenient way to expire frontend session when the backend session expire.
 * (frontend session = user property in this state)
 * At page load, the state of the backend session is synced with a call to /users/me:
 * if we get a 401 their is no active session, if not the user is connected.
 * But when the session expire in the backend, while the app has been loaded some time ago,
 * the frontend need a way to know it.
 * A convenient way to do it is to detect when a call to the backend result in a 401 error.
 * We use axios interceptors to detect this.
 * At this moment we need to remove the front end session (ie. delete user property in
 * this state). The only react way to do it is to use components.
 * The problem is, it's hard to have a function which is an axios interceptor and a
 * component at the same time.
 * The solution we found is to expose a reference of the setState function of this component.
 *
 * @returns {*}
 */
export let resetAuthContext = (): void => void 0;

export class AuthStore extends React.Component {
  _isMounted: boolean;
  state: {
    user: any;
    isLoading: boolean;
    connectionError: string | null;
  };

  constructor(props: any) {
    super(props);

    resetAuthContext = () =>
      this.setState({ user: null, isLoading: false, connectionError: null });

    this.state = {
      user: null,
      isLoading: true,
      connectionError: null,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.login();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  login = () => {
    this.setState({ isLoading: true });
    return httpClient
      .get(`${BACK_HOST}/api/users/me`)
      .then((response) => {
        if (this._isMounted) {
          this.setState({ user: response.data, isLoading: false });
        }
      })
      .catch((e) => {
        if (this._isMounted && !(e.response && e.response.status === 401)) {
          this.setState({
            user: null,
            isLoading: false,
            connectionError: getErrorMessages(e).join(' '),
          });
        }
      });
  };

  logout = () => {
    // will also empty user from state by reloading the entire app
    window.location.href = `${BACK_HOST}/api/users/sign_out`;
  };

  render() {
    const { children } = this.props;
    const { user, isLoading, connectionError } = this.state;

    return (
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          connectionError,
          login: this.login,
          logout: this.logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

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
