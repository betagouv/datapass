import axios from 'axios';
import { getErrorMessages } from '../../lib';

interface FetchResponse {
  data: any;
  isLoading: boolean;
  connectionError?: string | null;
}

export function useCustomGet(url: string): Promise<any> {
  return axios
    .get(url)
    .then((response: any) => {
      return {
        data: response.data,
        isLoading: false,
      };
    })
    .catch((e: any) => {
      if (e.response && e.response.status === 401) {
        // possible to redirect to the connection page by passing a router

        // or simply return an error
        return {
          isLoading: false,
          data: null,
          connectionErrorMessage: getErrorMessages(e).join(' '),
          connectionError: e,
        };
      }
    });
}

export function post() {
  //todo: create function
}

export function fetch() {
  //todo: create the decrorator for function axios.()
}
