var _ = require('lodash');
var log = require('../util/logger');

var errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    var notificationObj = req.body.content;

    var isValidAPN = (!_.isEmpty(notificationObj.apn) && _.isObject(notificationObj.apn));
    var isValidGCM = (!_.isEmpty(notificationObj.gcm) && _.isObject(notificationObj.gcm));

    if (!isValidAPN && !isValidGCM) {
      log.error('The request body must contain and \'apn\' OR a \'gcm\' non-empty object', notificationObj);
      return next(new errors.BadRequestError('The request body must contain and \'apn\' OR a \'gcm\' non-empty object'));
    }

    return next();
  };
};