'use strict';
const async = require('async');
const config = require('config');
const _ = require('lodash');
const log = require('../util/logger');

const transport = require('../transport/twilio');

const BATCH_LIMIT = config.get('platform_batch_limits.twilio');
const CUSTOM_BATCH_LIMIT = config.get('transport.twilio.batch_limit') || BATCH_LIMIT;

function sendSmsNotification(identities, body, callback) {

  const smsTargets = _.flatten(_.map(identities, function(identityItem) {
    return identityItem.devices.sms;
  }));

  let messageCounter = 0;
  async.forEachSeries(smsTargets, function(destination, done) {

    // Format sms object
    const sms = {
      to: destination,
      from: body.content.from,
      body: body.content.message
    };

    log.info('Sending request to send sms');
    log.debug('Sending request to send sms', sms);

    transport.sendSms(sms, function(err) {

      if (err) {
        return done(err);
      }

      messageCounter++;
      return done();
    });
  }, function(err) {

    if (err) {
      return callback(err);
    }

    log.info('Sent %d SMS messages to [%s]', messageCounter, smsTargets);
    log.info('Received response from sms request');
    log.debug('Received response from sms request');

    return callback();
  });
}

const smsOptions = {
  resourceName: 'devices.sms',
  batchLimit: _.min([BATCH_LIMIT, CUSTOM_BATCH_LIMIT]),
  projectionOptions: {'devices.sms': 1}
};

module.exports = {
  send: sendSmsNotification,
  options: smsOptions
};
