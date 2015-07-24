var errors = require('../util/errors');
var helper = require('../util/helper');
var external_services = require( process.cwd() + '/config/external_services');

var MAX_TWILIO_SMS_LENGTH = external_services.twilio.max_sms_length;

module.exports = function() {
  return function checkSms(req, res, next) {

    var smsObj = req.body;

    if (!smsObj) {
      return next(new errors.BadRequestError('Missing sms object'));
    }

    if (!smsObj.to) {
      return next(new errors.BadRequestError('Missing \'to\' property in SMS object'));
    }

    if (!smsObj.from) {
      return next(new errors.BadRequestError('Missing \'from\' property in SMS object'));
    }

    if (!smsObj.message) {
      return next(new errors.BadRequestError('Missing \'message\' property in SMS object'));
    }

    // Validate phone numbers' format
    if (!helper.phoneNumberIsValid(smsObj.to)) {
      return next(new errors.BadRequestError('Phone number in \'to\' field has no E.164 format'));
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