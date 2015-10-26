'use strict';
const _ = require('lodash');
const config = require('config');

const errors = require('../util/errors');
const log = require('../util/logger');
const helper = require('../util/helper');

const MAX_TWILIO_SMS_LENGTH = config.get('transport.twilio.max_sms_length');

module.exports = function() {
  return function checkSms(req, res, next) {

    const smsObj = req.body.content;

    if (_.isEmpty(smsObj.from) || !_.isString(smsObj.from) || !helper.isPhoneNumber(smsObj.from)) {
      log.error('Missing \'from\' property in parameters', smsObj);
      return next(new errors.BadRequestError('Missing \'from\' property in parameters'));
    }

    if (_.isEmpty(smsObj.message) || !_.isString(smsObj.message)) {
      log.error('Missing \'message\' String property in request body \'content\' object', smsObj);
      return next(new errors.BadRequestError('Missing \'message\' String property in request body \'content\' object'));
    }

    if (smsObj.message.length > MAX_TWILIO_SMS_LENGTH) {
      log.error('Message cannot be longer than ' + MAX_TWILIO_SMS_LENGTH + ' characters', smsObj);
      return next(new errors.BadRequestError('Message cannot be longer than ' + MAX_TWILIO_SMS_LENGTH + ' characters'));
    }

    return next();
  };
};
