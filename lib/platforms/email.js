var request = require('request');
var config = require('config');
var async = require('async');
var log = require('../util/logger');
var identityPlatform = require('./identity');

module.exports = {
    sendEmail: sendEmailNotification
};

function sendEmailNotification(body, callback) {

    var emails = [];

    log.info('Iterating on identity ids to get emails');
    log.debug('Iterating on identity ids to get emails', body.to);

    async.forEachSeries(body.to, function(identityId, done){

        identityPlatform.get(identityId, function(err, identityDB){

            if (err) {

                log.error('Error getting Identity', err);
                return done(err);
            }

            emails = emails.concat(identityDB.devices.email);

            done();
        });
    }, function(err) {

        if (err) {

            log.error('Error getting all the emails from identities', err);
            return callback(err);
        }

        MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + config.get('mailer.mailgun.domain') + '/messages';

        // Format email object
        var data = {
            to: emails,
            from: body.from,
            subject: body.subject,
            html: body.message
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
    });
}
