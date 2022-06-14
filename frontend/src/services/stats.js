import { memoize } from 'lodash';
import { hashToQueryParams } from '../lib';
import httpClient from '../lib/http-client';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export async function getAPIStats(target_api_list) {
  return httpClient.get(
    `${BACK_HOST}/api/stats${hashToQueryParams({
      target_api_list: target_api_list,
    })}`,
    {
      headers: { 'Content-type': 'application/json' },
    }
  );
}

export async function getMajorityPercentileProcessingTimeInDays(target_api) {
  return httpClient.get(
    `${BACK_HOST}/api/stats/majority_percentile_processing_time_in_days${hashToQueryParams(
      {
        target_api,
      }
    )}`,
    {
      headers: { 'Content-type': 'application/json' },
    }
  );
}

export const getCachedMajorityPercentileProcessingTimeInDays = memoize(
  getMajorityPercentileProcessingTimeInDays
);
