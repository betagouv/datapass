import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { resetAuthContext } from '../components/organisms/AuthContext';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

axios.defaults.adapter = httpAdapter;

// to know when to send a request with credentials
axios.interceptors.request.use((config) => {
  if (
    new URL(config.url).origin === BACK_HOST &&
    !new URL(config.url).pathname.startsWith('/api/stats')
  ) {
    config.withCredentials = true;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      new URL(error.config.url).origin === BACK_HOST
    ) {
      // This is bad. Find out why in this function doc !
      resetAuthContext();
    }

    return Promise.reject(error);
  }
);

export default axios;
