import { useState, useEffect } from 'react';
import qs from 'query-string';
import { isEmpty, isObject } from 'lodash';

const updateURL = (qsValue: string) => {
  const newurl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    qsValue;

  window.history.pushState({ path: newurl }, '', newurl);
};

const getQueryStringValue = (key: string) => {
  const values: any = qs.parse(window.location.search);

  // Check if its an object first
  try {
    return JSON.parse(values[key]);
  } catch (error) {
    // Ignoring silently
  }

  return values[key];
};

const setQueryStringValue = (key: string, value: any) => {
  const values = qs.parse(window.location.search);
  const newQsValue = qs.stringify({
    ...values,
    [key]: isObject(value) ? JSON.stringify(value) : value,
  });
  updateURL(`?${newQsValue}`);
};

const useQueryString = (
  key: string,
  initialValue: any,
  forceInitialization: boolean = false
) => {
  const queryStringValue = getQueryStringValue(key);
  if (!queryStringValue && forceInitialization && !isEmpty(initialValue)) {
    setQueryStringValue(key, initialValue);
  }

  const [value, setValue] = useState(queryStringValue || initialValue);

  useEffect(() => {
    setQueryStringValue(key, value);
  }, [key, value]);

  return [value, setValue];
};

export default useQueryString;
