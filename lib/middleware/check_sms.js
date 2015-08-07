var _ = require('lodash');
var errors = require('../util/errors');
var helper = require('../util/helper');
var config = require('config');

var MAX_TWILIO_SMS_LENGTH = config.twilio.max_sms_length;

module.exports = function() {
  return function checkSms(req, res, next) {

    var smsObj = req.body;

    if (!smsObj || _.isEmpty(smsObj)) {
      return next(new errors.BadRequestError('Missing SMS object'));
    }

    if (!smsObj.to || _.isEmpty(smsObj.to)) {
      return next(new errors.ConflictError('Missing \'to\' property in SMS object'));
    }

    if (!smsObj.from || _.isEmpty(smsObj.from)) {
      return next(new errors.ConflictError('Missing \'from\' property in SMS object'));
    }

    if (!smsObj.message) {
      return next(new errors.ConflictError('Missing \'message\' property in SMS object'));
    }

    if (!helper.phoneNumberIsValid(smsObj.from)) {
      return next(new errors.BadRequestError('Phone number in \'from\' field has no E.164 format'));
    }

    if (smsObj.message.length > MAX_TWILIO_SMS_LENGTH) {
      return next(new errors.BadRequestError('Message cannot be longer than ' + MAX_TWILIO_SMS_LENGTH + ' characters'));
    }

    return next();
  };
};