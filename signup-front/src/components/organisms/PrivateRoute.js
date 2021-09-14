import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withUser } from './UserContext';
import { Login } from '../templates/Login';

// We do not use isLoading, connectionError, login, logout but we do not want these properties to be forwarded downward as there are added ia the withUser HOC
const PrivateRoute = ({
  component: Component,
  user,
  isLoading,
  connectionError,
  login,
  logout,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (user ? <Component {...props} /> : <Login {...props} />)}
  />
);

PrivateRoute.propTypes = {
  user: PropTypes.object,
};

PrivateRoute.defaultProps = {
  user: null,
};

export default withUser(PrivateRoute);
