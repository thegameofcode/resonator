var config = require('config');
var _ = require('lodash');
var log = require('../util/logger');
var transport = require('../transport/mailgun');

var BATCH_LIMIT = config.get('platform_batch_limits.mailgun');
var CUSTOM_BATCH_LIMIT = config.get('transport.mailgun.batch_limit') || BATCH_LIMIT;

function sendEmailNotification(identities, body, callback) {

  var emails = _.flatten(_.map(identities, function(identity) {
    return identity.devices.email;
  }));

  log.info('Sending request to send emails');

  transport.send(emails, body.content, function (err, response, body) {

    if (err) {
      return callback(err);
    }

    var output = {
      response: response,
      body: body
    };

    log.info('Receiving response from email request');
    log.debug('Receiving response from email request', body);

    return callback(null, output);
  });
}

var emailOptions = {
  resourceName: 'devices.email',
  batchLimit: _.min([BATCH_LIMIT, CUSTOM_BATCH_LIMIT]),
  projectionOptions: {'devices.email': 1}
};

module.exports = {
  send: sendEmailNotification,
  options: emailOptions
};
