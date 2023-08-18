import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { resetAuthContext } from '../components/organisms/AuthContext';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

axios.defaults.adapter = httpAdapter;

axios.interceptors.request.use((config) => {
  if (config.url) {
    const requestURL = new URL(config.url);
    if (
      requestURL.origin === BACK_HOST &&
      !requestURL.pathname.startsWith('/api/stats')
    ) {
      config.withCredentials = true;
    }
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config && error.config.url) {
      const errorURL = new URL(error.config.url);
      if (error.response?.status === 401 && errorURL.origin === BACK_HOST) {
        resetAuthContext();
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
