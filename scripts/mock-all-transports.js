var proxyquire  = require('proxyquire');

var log = require('../lib/util/logger');

var noop = function() {};

proxyquire('../lib/platforms/sms', {
  '../transport/twilio': {
    sendSms: function(sms, done) {
      log.warn('Faking Twilio call with params: ', sms);
      done();
    }
  }
});

proxyquire('../lib/platforms/push', {
  '../transport/apn': {
    pushNotification: function(apnConnection, apnDevices, alert, content, callback) {
          log.warn('Faking APN call with params: ', apnDevices, alert, content);
      callback();
    }
  },
  '../transport/gcm': {
    sendGCM: function(devices, data, more, callback) {
      log.warn('Faking GCM call with params: ', gcmDevices, data);
      callback();
    }

  }
});

proxyquire('../lib/platforms/email', {
  '../transport/mailgun': {
    send: function(emails, content, callback) {
      log.warn('Faking EMAIL call with params: ', emails, content);
      callback();
    }
  }
});

