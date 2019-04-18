import React from 'react';
import { modules } from "Components/modules/Routes";
import qs from 'query-string';

export const getRoutePath = (name, data) => {
    const route = modules.find(route => route.name === name);

    if (!route) {
        return '';
    }

    let routePath = route.path;
    if (data && typeof data === 'object') {
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`:${key}`, 'g');
            routePath = routePath.replace(regex, data[key]);
        });
    }

    return routePath;
};

export const getErrorMessage = error => {
  if (!error) {
    return '';
  }

  if (error.response && error.response.data) {
    if (error.response.data.message) {
      return error.response.data.message;
    }

    if (Array.isArray(error.response.data) && error.response.data.length > 0 && error.response.data[0].message) {
      return error.response.data[0].message;
    }
  }

  if (error.message) {
    return error.message;
  }

  return 'Unknown error occurr!';
};

export const toQueryStringOld = data => {
  if (typeof data !== 'object' || data === null) {
    return '';
  }

  const params = Object.keys(data).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  });

  return params.join('&');
};

export const toQueryString = data => {
  return qs.stringify(data);
};

export const parseQueryString = queryString => {
  return qs.parse(queryString);
};

/**
 * Get feedback for field from validate result of validaejs
 * @param {string} fieldName field name
 * @param {object} validateResult validate result from validatejs
 */
export const getValidateFeedback = (fieldName, validateResult) => {
  if (!validateResult || !validateResult[fieldName]) {
    return null;
  }

  return (
    <div className="invalid-feedback d-block">
      {validateResult[fieldName]}
    </div>
  );
};
