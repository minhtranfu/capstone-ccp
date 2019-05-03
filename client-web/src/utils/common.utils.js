import React from 'react';
import { modules } from "Components/modules/Routes";
import qs from 'query-string';
import ConfigService from 'Services/common/config-service';
import { routeConsts } from 'Common/consts';

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

const actionRouteMapping = {
  materialTransactions: routeConsts.MATERIAL_TRANSACTION_DETAIL,
  hiringTransactions: routeConsts.EQUIPMENT_TRANSACTION_DETAIL,
  debrisTransactions: routeConsts.DEBRIS_REQUEST_DETAIL,
  equipments: routeConsts.EQUIPMENT_DETAIL
};

export const getRouteFromClickAction = clickAction => {
  const info = clickAction.split('/');
  const action = info[0];
  const id = info[1];

  const routeConst = actionRouteMapping[action];
  if (!routeConst) {
    return '';
  }

  return getRoutePath(routeConst, { id });
};

/**
 * Calculate distance
 */
const toRad = (value) => {
  return value * Math.PI / 180;
};

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export const calcDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d.toFixed(1);
};

export const getRefreshToken = () => {
  const key = ConfigService.getRefreshTokenKey();

  return localStorage.getItem(key);
};

export const setRefreshToken = value => {
  const key = ConfigService.getRefreshTokenKey();

  return localStorage.setItem(key, value);
};

export const getJwtToken = () => {
  const key = ConfigService.getJwtKey();

  return localStorage.getItem(key);
};

export const setJwtToken = value => {
  const key = ConfigService.getJwtKey();

  return localStorage.setItem(key, value);
};

export const setTokens = (jwt, refresh) => {
  setJwtToken(jwt);
  setRefreshToken(refresh);
};
