import axios from 'axios';
import { DateTime } from 'luxon';

import { getFormattedError } from './error';

const AUTH_TOKEN = 'AUTH_TOKEN';

export const defaults = {
  perPage: 10,
};

const BASEURL="http://localhost:8080/api"
export const serviceInstance = axios.create({
  baseURL: BASEURL,
});

serviceInstance.interceptors.request.use(axiosConfig => {
  const token = window.localStorage.getItem(AUTH_TOKEN);

  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }

  return axiosConfig;
});

serviceInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response && error.response.data) {
      const apiError = error.response.data;

      const details = getFormattedError(apiError);

      return Promise.reject({ timestamp: apiError.timestamp, details, type: apiError.type });
    }

    return Promise.reject({ timestamp: DateTime.utc().toJSON(), details: error.toJSON().message });
  },
);

export function setAuthToken(token) {
  window.localStorage.setItem(AUTH_TOKEN, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN);
}
