var request = require('request');
var config = require('config');
var _ = require('lodash');
var log = require('../util/logger');

var MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + config.get('mailer.mailgun.domain') + '/messages';
var BATCH_LIMIT = config.get('mailer.mailgun.batch_limit');
var CUSTOM_BATCH_LIMIT = config.get('mailer.mailgun.custom_batch_limit') || BATCH_LIMIT;

function sendEmailNotification(identities, body, callback) {

  var emails = _.flatten(_.map(identities, function(identity) {
    return identity.devices.email;
  }));

      // Format email object
      var data = {
        to: emails,
        from: body.content.from,
        subject: body.content.subject,
        html: body.content.message
      };

      log.info('Sending request to send emails');
      log.debug('Sending request to send emails', data);

      request({
        url: MAILGUN_MESSAGES_URL,
        method: 'POST',
        json: true,
        auth: {
          user: 'api',
          pass: config.get('mailer.mailgun.apiKey'),
          sendImmediately: true
        },
        formData: data

      }, function (err, response, body) {

        if (err) {
          log.error('Error sending request to send emails', err);
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