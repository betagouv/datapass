import { hashToQueryParams } from '../lib';
import httpClient from '../lib/http-client';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function getUsers({
  usersWithRolesOnly = true,
  filter = [],
  page = null,
  size = null,
}) {
  const formatedFilter = filter.map(({ id, value }) => ({
    key: id,
    value,
  }));

  const queryParam = hashToQueryParams({
    users_with_roles_only: usersWithRolesOnly,
    page,
    size,
    filter: formatedFilter,
  });

  return httpClient
    .get(`${BACK_HOST}/api/users${queryParam}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function updateUser({
  id,
  roles = [],
}: {
  id: number;
  roles: string[];
}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return httpClient
    .patch(`${BACK_HOST}/api/users/${id}`, { user: { roles } }, config)
    .then(({ data }) => data);
}

export function createUser({ email }: { email: string }) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return httpClient
    .post(`${BACK_HOST}/api/users`, { user: { email } }, config)
    .then(({ data }) => data);
}
