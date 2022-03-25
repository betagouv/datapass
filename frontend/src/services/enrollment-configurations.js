import httpClient from '../lib/http-client';
import { memoize } from 'lodash';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

function getEnrollmentConfiguration(targetApi) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollment_configurations/${targetApi}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data: { configuration } }) => configuration);
}

export const getCachedEnrollmentConfiguration = memoize(
  getEnrollmentConfiguration
);
