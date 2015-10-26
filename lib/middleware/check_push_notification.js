'use strict';
const _ = require('lodash');

const log = require('../util/logger');
const errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    const notificationObj = req.body.content;

    const isValidAPN = (!_.isEmpty(notificationObj.apn) && _.isObject(notificationObj.apn));
    const isValidGCM = (!_.isEmpty(notificationObj.gcm) && _.isObject(notificationObj.gcm));

    if (!isValidAPN && !isValidGCM) {
      log.error('The request body must contain and \'apn\' OR a \'gcm\' non-empty object', notificationObj);
      return next(new errors.BadRequestError('The request body must contain and \'apn\' OR a \'gcm\' non-empty object'));
    }

    return next();
  };
};
