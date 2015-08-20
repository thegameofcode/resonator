require('./../global_conf');

var expect = require('chai').expect;
var _ = require('lodash');

var checkSms = require('./../../lib/middleware/check_sms');
var config = require('config');
var MAX_TWILIO_SMS_LENGTH = config.get('transport.twilio.max_sms_length');

describe('SMS middleware', function() {

  var smsNotificationUrl = '/api/push/sms';

  var smsObj = {};

  var request = {
    url: smsNotificationUrl,
    method: 'POST',
    json: true,
    headers: {}
  };

  beforeEach(function(done) {
    request.headers['x-user-id'] = '01f0000000000000003f0003';
    smsObj = {
      identities: ["01f0000000000000003f0002", "01f0000000000000003f0003"],
      channels: ["friends"],
      content: {
        from: "+15005550006",
        message: "Hello there!"
      }
    };
    done();
  });

  it('returns a BadRequestError for a missing \'from\' field', function(done) {

    delete smsObj.content.from;

    request.body = smsObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'from\' property in parameters');
      done();
    };

    checkSms()(request, res, next);
  });

  it('returns a BadRequestError for a missing \'message\' field', function(done) {

    delete smsObj.content.message;

    request.body = smsObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'message\' property in parameters');
      done();
    };

    checkSms()(request, res, next);
  });

  it('returns a BadRequestError for a message that exceeds Twilio\'s limit', function(done) {

    smsObj.content.message = _.repeat('a', MAX_TWILIO_SMS_LENGTH + 1);

    request.body = smsObj;

    var res = {};
    var next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Message cannot be longer than ' + MAX_TWILIO_SMS_LENGTH + ' characters');
      done();
    };

    checkSms()(request, res, next);
  });

  it('passes all validation for an SMS message with length equal to Twilio\'s limit', function(done) {

    smsObj.content.message = _.repeat('a', MAX_TWILIO_SMS_LENGTH);

    request.body = smsObj;

    var res = {};
    var next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkSms()(request, res, next);
  });

  it('passes all validation for an SMS message with length less than Twilio\'s limit', function(done) {

    smsObj.content.message = _.repeat('a', 100);

    request.body = smsObj;

    var res = {};
    var next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkSms()(request, res, next);
  });
});