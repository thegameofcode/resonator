var _ = require('lodash');
var log = require('../util/logger');

var errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    var reqBody = req.body;
    var notificationObj = req.body.content;

    if (_.isEmpty(notificationObj)) {
      log.error('Missing notification parameters', notificationObj);
      return next(new errors.BadRequestError('Missing notification parameters'));
    }

    if ((!reqBody.identities && !reqBody.channels) || (_.isEmpty(reqBody.identities) && _.isEmpty(reqBody.channels)) ) {

      log.error('The request body must contain at least one target channel or identity', notificationObj);
      return next(new errors.BadRequestError('The request body must contain at least one target channel or identity'));
    }

    if ((!notificationObj.apn && !notificationObj.gcm) || (_.isEmpty(notificationObj.apn) && _.isEmpty(notificationObj.gcm))) {
      return next(new errors.BadRequestError('The request body must contain and \'apn\' or a \'gcm\' object'));
    }

    return next();
  };
};