import { DATA_PROVIDER_CONFIGURATIONS } from '../config/data-provider-configurations';
import httpClient from '../lib/http-client';
import { memoize } from 'lodash';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

function getDataProviderConfiguration(targetApi) {
  return httpClient
    .get(`${BACK_HOST}/api/data_provider_configurations/${targetApi}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data: { configuration } }) => configuration);
}

export const getCachedDataProviderConfiguration = memoize(
  getDataProviderConfiguration
);

function getDataProviderConfigurations() {
  return httpClient
    .get(`${BACK_HOST}/api/data_provider_configurations`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data: { configurations } }) => configurations);
}

export const getCachedDataProviderConfigurations = memoize(
  getDataProviderConfigurations
);
