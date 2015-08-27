var async = require('async');
var config = require('config');
var _ = require('lodash');
var log = require('../util/logger');
var errors = require('../util/errors');

var transport = require('../transport/twilio');

var BATCH_LIMIT = config.get('platform_batch_limits.twilio');
var CUSTOM_BATCH_LIMIT = config.get('transport.twilio.batch_limit') || BATCH_LIMIT;

function sendSmsNotification(identities, body, callback) {

  var smsTargets = _.flatten(_.map(identities, function(identityItem) {
    return identityItem.devices.sms;
  }));

  var messageCounter = 0;
  async.forEachSeries(smsTargets, function (destination, done) {

    // Format sms object
    var sms = {
      to: destination,
      from: body.content.from,
      body: body.content.message
    };

    log.info('Sending request to send sms');
    log.debug('Sending request to send sms', sms);

    transport.sendSms(sms, function (err) {

      if (err) {
        return done(new errors.InternalError('Could not send SMS notifications to destinations'));
      }

      messageCounter++;
      return done();
    });
  }, function (err) {

    if (err) {
      return callback(err); // Controlled error
    }

    log.info('Sent %d SMS messages to [%s]', messageCounter, smsTargets);
    log.info('Received response from sms request');
    log.debug('Received response from sms request');

    return callback();
  });
}

var smsOptions = {
  resourceName: 'devices.sms',
  batchLimit: _.min([BATCH_LIMIT, CUSTOM_BATCH_LIMIT]),
  projectionOptions: {'devices.sms': 1}
};

module.exports = {
  send: sendSmsNotification,
  options: smsOptions
};
