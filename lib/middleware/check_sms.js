var _ = require('lodash');
var errors = require('../util/errors');
var helper = require('../util/helper');
var config = require('config');

var MAX_TWILIO_SMS_LENGTH = config.get('transport.twilio.max_sms_length');

module.exports = function() {
  return function checkSms(req, res, next) {

    var smsObj = req.body.content;

    if (_.isEmpty(smsObj.from) || !_.isString(smsObj.from) || !helper.isPhoneNumber(smsObj.from)) {
      return next(new errors.BadRequestError('Missing \'from\' property in parameters'));
    }

    if (_.isEmpty(smsObj.message) || !_.isString(smsObj.message)) {
      return next(new errors.BadRequestError('Missing \'message\' String property in request body \'content\' object'));
    }

    if (smsObj.message.length > MAX_TWILIO_SMS_LENGTH) {
      return next(new errors.BadRequestError('Message cannot be longer than ' + MAX_TWILIO_SMS_LENGTH + ' characters'));
    }

    return next();
  };
};