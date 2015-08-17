var _ = require('lodash');
var errors = require('../util/errors');
var log = require('../util/logger');
var config = require('config');

var MAX_TWILIO_SMS_LENGTH = config.twilio.max_sms_length;

module.exports = function() {
  return function checkSms(req, res, next) {

    var reqBody = req.body;
    var smsObj = req.body.content;

    if (_.isEmpty(smsObj)) {

      log.error('Missing SMS parameter', smsObj);
      return next(new errors.BadRequestError('Missing SMS parameters'));
    }

    if ((!reqBody.identities && !reqBody.channels) || (_.isEmpty(reqBody.identities) && _.isEmpty(reqBody.channels)) ) {

      log.error('The request body must contain at least one target channel or identity', smsObj);
      return next(new errors.BadRequestError('The request body must contain at least one target channel or identity'));
    }

    if (!smsObj.from || _.isEmpty(smsObj.from)) {

      log.error('Missing \'from\' property in parameters', smsObj);
      return next(new errors.BadRequestError('Missing \'from\' property in parameters'));
    }

    if (!smsObj.message || _.isEmpty(smsObj.message)) {

      log.error('Missing \'message\' property in parameters', smsObj);
      return next(new errors.BadRequestError('Missing \'message\' property in parameters'));
    }

    if (smsObj.message.length > MAX_TWILIO_SMS_LENGTH) {

      log.error('Message cannot be longer than ' + MAX_TWILIO_SMS_LENGTH + ' characters', smsObj);
      return next(new errors.BadRequestError('Message cannot be longer than ' + MAX_TWILIO_SMS_LENGTH + ' characters'));
    }

    return next();
  };
};