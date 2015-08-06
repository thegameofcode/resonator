var async = require('async');
var gcm = require('../util/gcm');
var apn = require('../util/apn');
var identity = require('../platforms/identity');
var errors = require('../util/errors');

module.exports = {
    sendPush: sendPushNotification
};

function sendPushNotification(body, callback) {

    var to = body.to;
    var data = body.message;

    var options = {onlyApn: true, onlyGcm: true};

    if(body.options){

        if (body.options.onlyApn && body.options.onlyGcm) {

            console.log('Notification not sent: onlyApn & onlyGcm both set at true');

            return callback(new errors.BadRequestError('onlyApn & onlyGcm both set at true.'));
        } else if (body.options.onlyGcm) {

            options.onlyApn = false;
        } else if (body.options.onlyApn ) {

            options.onlyGcm = false;
        }
    }

    var onlyGcm = options.onlyGcm;
    var onlyApn = options.onlyApn;

    var deviceTokens = [];
    var regIds = [];

    async.forEachSeries(to, function(identityId, done){

        identity.get(identityId, function(err, identityDB){

            if (err) return done(err);

            deviceTokens = deviceTokens.concat(identityDB.devices.apn);
            regIds = regIds.concat(identityDB.devices.gcm);

            done();
        });
    }, function(err) {

        if (err) return callback(err);

        var sent = {
            "GCM": [],
            "APN": []
        };

        async.parallel([

            function(done) {

                if ( onlyGcm ) {

                    console.log('Sending PUSH to GCM[' + regIds + ']');

                    sent.GCM = sent.GCM.concat(regIds);

                    gcm.sendGCM(regIds, data, {}, done);
                } else {

                    done();
                }
            },
            function(done) {

                if ( onlyApn ) {

                    console.log('Sending PUSH to APN[' + deviceTokens + ']');

                    sent.APN = sent.APN.concat(deviceTokens);

                    apn.pushNotification(deviceTokens, data, body, done);
                } else {

                    done();
                }
            }
        ], function(err){

            if (err) return callback(err);

            return callback(null, sent);
        });
    });
}