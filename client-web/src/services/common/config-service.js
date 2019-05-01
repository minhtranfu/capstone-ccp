'use strict';

const DomainObjectService = require('./domain-object-service');
const NodeUtils = require('./node-service');

module.exports = {
  getConfig () {
    return process.env.APP_CONFIG;
  },
  getProperty (key) {
    if (!key) throw new Error('Key cannot be null/undefined');
    return DomainObjectService.getPropertyValue(
      this.getConfig(), key
    );
  },
  getRequiredProperty (key) {
    const value = this.getProperty(key);
    if (value) return value;
    if (!NodeUtils.isTest()) {
      throw new Error(`Missing required property: "${key}"`);
    }
  },
  getPort () {
    return this.getRequiredProperty('ccp.port');
  },
  getBasePath () {
    return this.getRequiredProperty('ccp.basePath');
  },
  getBaseUrl () {
    return this.getRequiredProperty('ccp.baseUrl');
  },
  getJwtKey () {
    return this.getRequiredProperty('ccp.jwtKey');
  },
  getRefreshTokenKey () {
    return this.getRequiredProperty('ccp.refreshTokenKey');
  }
};
