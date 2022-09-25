import React from 'react';
import { getErrorMessages } from '../../lib';
import { useCustomGet } from '../clients/HttpClientHooks';
import { Login } from '../templates/Login';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

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
  getIsUserAnInstructor: (target_api: string) => boolean;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
  connectionError: null,
  login: () => {},
  logout: () => {},
  getIsUserAnInstructor: (target_api) => false,
});

export const useAuth = () => {
  return React.useContext(AuthContext);
};

/**
 * Do not try this at home: trying to modify a state of a component outside React is not recommended!
 * We needed a convenient way to expire frontend session  .
 * (frontend session = user property in this state)
 * At page load, the state of the backend session is synced with a call to /users/me:
 * if we get a 401 there is no active session, if not the user is connected.
 * But when the session expire in the backend, while the app has been loaded some time ago,
 * the frontend need a way to know it.
 * A convenient way to do it is to detect when a call to the backend result in a 401 error.
 * We use axios interceptors to detect this.
 * At this moment we need to remove the front end session (ie. delete user property in
 * this state). The only React way to do it is to use components.
 * The problem is, it's hard to have a function which is an axios interceptor and a
 * component at the same time.
 * The solution we found is to expose a reference of the setState function of this component.
 *
 * @returns {*}
 */
export let resetAuthContext = (): void => {};

/**
 * Not a satisfaying solution? Other solutions
 * - Add a token expiration time for token from backend, if token is expired, possible to renew it silently
 * - Actually, to check authentication, we generate an error 401 with /me, would be better to stop volontary generate error => how?
 * Other hint: use an isAuthenticated, property, check this property when auth required
 */

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

  login = async () => {
    this.setState({ isLoading: true });
    const res = await useCustomGet(`${BACK_HOST}/api/users/me`);

    // handle error resetting context
    if (res.connectionError && res.connectionError.response.status === 401) {
      this.setState({
        user: null,
        isLoading: false,
        connectionError: getErrorMessages(res.connectionError).join(' '),
      });
    } else {
      this.setState({ user: res.data, isLoading: false });
    }
  };

  logout = () => {
    // will also empty user from state by reloading the entire app
    // incomplete checkout
    window.location.href = `${BACK_HOST}/api/users/sign_out`;
  };

  getIsUserAnInstructor = (target_api: string) => {
    const targetApiInstructorRole = `${target_api}:instructor`;

    return this.state.user.roles.includes(targetApiInstructorRole);
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
          getIsUserAnInstructor: this.getIsUserAnInstructor,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

// i like this component that let's to know when authentication is required
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
