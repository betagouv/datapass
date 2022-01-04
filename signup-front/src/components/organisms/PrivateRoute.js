import React from 'react';
import { Route } from 'react-router-dom';
import { withUser } from './UserContext';
import { Login } from '../templates/Login';

const PrivateRoute = ({ children, user, ...rest }) => (
  <Route {...rest}>{user ? children : <Login />}</Route>
);

export default withUser(PrivateRoute);
