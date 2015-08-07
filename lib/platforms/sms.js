var twilio = require('twilio');
var async = require('async');
var config = require('config');

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

    async.forEachSeries(body.to, function(identityId, done){

        identityPlatform.get(identityId, function(err, identityDB){

            if (err) return done(err);

            numbers = numbers.concat(identityDB.devices.sms);

            done();
        });
    }, function(err) {

        if (err) return callback(err);

        var messageCounter = 0;
        async.forEachSeries(numbers, function (destination, done) {

            // Format sms object
            var sms = {
                to: destination,
                from: body.from,
                body: body.message
            };

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
                return callback(err);
            }

            return callback(null, {
                "messages": messageCounter,
                "targets": numbers,
                "source": body.from,
                "text": body.message
            });
        });
    });
}
