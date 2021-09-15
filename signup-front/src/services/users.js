import { hashToQueryParams } from '../lib';
import httpClient from '../lib/http-client';

const BACK_HOST = process.env.VITE_BACK_HOST;

export function getUsers({ usersWithRolesOnly = true }) {
  const queryParam = hashToQueryParams({
    users_with_roles_only: usersWithRolesOnly,
  });
  return httpClient
    .get(`${BACK_HOST}/api/users${queryParam}`)
    .then(({ data }) => data);
}

export function updateUser({ id, roles = [] }) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return httpClient
    .patch(`${BACK_HOST}/api/users/${id}`, { user: { roles } }, config)
    .then(({ data }) => data);
}

export function createUser({ email }) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return httpClient
    .post(`${BACK_HOST}/api/users`, { user: { email } }, config)
    .then(({ data }) => data);
}
