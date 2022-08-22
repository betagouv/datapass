import { hashToQueryParams } from '../lib';
import axios from 'axios';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function getUsers({ usersWithRolesOnly = true }) {
  const queryParam = hashToQueryParams({
    users_with_roles_only: usersWithRolesOnly,
  });
  return axios
    .get(`${BACK_HOST}/api/users${queryParam}`)
    .then(({ data }) => data);
}

export function updateUser({ id, roles = [] }) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios
    .patch(`${BACK_HOST}/api/users/${id}`, { user: { roles } }, config)
    .then(({ data }) => data);
}

export function createUser({ email }) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios
    .post(`${BACK_HOST}/api/users`, { user: { email } }, config)
    .then(({ data }) => data);
}
