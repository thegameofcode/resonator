var twilio = require('twilio');
var async = require('async');
var config = require('config');
var log = require('../util/logger');

var identityPlatform = require('./identity');
var TWILIO_ACCOUNT_SID = config.twilio.account_sid;
var TWILIO_AUTH_TOKEN = config.twilio.auth_token;

if (process.env.NODE_ENV === 'test') {
    TWILIO_ACCOUNT_SID = "Some_random_account_sid";
    TWILIO_AUTH_TOKEN = "Some_random_auth_token";
}

messager = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = {
    sendSms: sendSmsNotification
};

function sendSmsNotification(body, callback) {

    var numbers = [];

    log.info('Iterating on identity ids to get sms');
    log.debug('Iterating on identity ids to get sms', body.to);

    async.forEachSeries(body.to, function(identityId, done){

        identityPlatform.get(identityId, function(err, identityDB){

            if (err) return done(err);

            numbers = numbers.concat(identityDB.devices.sms);

            done();
        });
    }, function(err) {

        if (err) {

            log.error('Error getting the identity ids', err);
            return callback(err);
        }

        var messageCounter = 0;
        async.forEachSeries(numbers, function (destination, done) {

            // Format sms object
            var sms = {
                to: destination,
                from: body.from,
                body: body.message
            };

            log.info('Sending request to send sms');
            log.debug('Sending request to send sms', sms);

            messager.sendSms(sms, function (err) {

                if (err) {
                    return done(err);
                }
                messageCounter++;
                return done();
            });
        }, function (err) {
            console.log('SMS', err);

            if (err) {

                log.error('Error sending sms notifications', err);
                return callback(err);
            }
            var sent = {
                "messages": messageCounter,
                "targets": numbers,
                "source": body.from,
                "text": body.message
            };

            log.info('Receiving response from sms request');
            log.debug('Receiving response from sms request', sent);

            return callback(null, sent);
        });
    });
}
