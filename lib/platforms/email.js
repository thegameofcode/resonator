var request = require('request');
var config = require('config');
var async = require('async');
var _ = require('lodash');
var log = require('../util/logger');
var errors = require('../util/errors');
var identityPlatform = require('./identity');
var channelPlatform = require('./channel');

var MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + config.get('mailer.mailgun.domain') + '/messages';
var BATCH_LIMIT = config.get('mailer.mailgun.batch_limit');
module.exports = {
    sendEmail: sendEmailNotification
};

function sendEmailNotification(body, callback) {

  log.info('Retrieving identities to get emails');
  log.debug('Retrieving identities to get emails', body.channels, body.identities);

  var targetChannels = body.channels || [];
  var targetIdentities = body.identities || [];

  async.waterfall([
    function retrieveChannelIdentities(done) {

      if (_.isEmpty(targetChannels)) {
        return done(null, []);
      }

      channelPlatform.findChannelsByFieldValue('name', targetChannels, function(err, foundChannels) {

        if (err) {
          return done(new errors.InternalError('Could not retrieve identities from specified channels'));
        }

        // Leave only the identities' IDs
        var channelIdentities = _.map(foundChannels, function(channel) {
          return channel.identityRef;
        });

        log.info('Retrieved all channels');
        log.debug('Retrieved all channels', channelIdentities);

        return done(null, channelIdentities);
      });
    },
    function retrieveIdentities(channelIdentities, done) {

      var identities = _.unique(_.flatten(targetIdentities.concat(channelIdentities)));

      log.info('Retrieved all identities');
      log.debug('Retrieved all identities', identities);

      return done(null, identities);
    },
    function retrieveEmails(identities, done) {

      identityPlatform.findIdentitiesByFieldValue('_id', identities, function(err, foundIdentities) {

        if (err) {
          return done(new errors.InternalError('Could not obtain the target emails'));
        }

        var emails = _.map(foundIdentities, function(identity) {
          return identity.devices.email;
        });

        emails = _.unique(_.flatten(emails));

        //TODO: implement logic that sends emails in several steps when the number of target emails is over the Mailgun batch limit
        if (emails.length > BATCH_LIMIT) {
          return done(new errors.BadRequestError('The number of email targets is over ' + BATCH_LIMIT));
        }

        log.info('Retrieved emails from channels and identities');
        log.debug('Retrieved emails from channels and identities', emails);

        return done(null, emails);
      });
    }
  ],
    function sendEmailToTargets(err, emails) {

      if (err) {
        return callback(err);
      }

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
        json:true,
        auth: {
          user: 'api',
          pass: config.mailer.mailgun.apiKey,
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
  );
}
