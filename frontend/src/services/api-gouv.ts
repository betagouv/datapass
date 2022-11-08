import httpClient from '../lib/http-client';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

type ListApi = {
  title: string;
  slug: string;
  tagline: string;
  path: string;
  logo: string;
  pass_path: string;
};

export function getApisList(): Promise<ListApi[]> {
  return httpClient
    .get(`${BACK_HOST}/api/api_gouv/apis`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}
