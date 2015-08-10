var async = require('async');
var gcm = require('../util/gcm');
var apn = require('../util/apn');
var identityPlatform = require('../platforms/identity');
var errors = require('../util/errors');
var Identity = require('../models/identity');
var log = require('../util/logger');

module.exports = {
    sendPush: sendPushNotification,
    deleteApnDevices: deleteApnDevices
};

function sendPushNotification(body, callback) {

    log.info('Sending push notifications');
    log.debug('Sending push notifications', body);

    var to = body.to;
    var data = body.message;

    var options = {onlyApn: true, onlyGcm: true};

    if(body.options){

        if (body.options.onlyApn && body.options.onlyGcm) {

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

    log.info('Iterating on identity ids');
    log.debug('Iterating on identity ids', to);

    async.forEachSeries(to, function(identityId, done){

        identityPlatform.get(identityId, function(err, identityDB){

            if (err) return done(err);

            deviceTokens = deviceTokens.concat(identityDB.devices.apn);
            regIds = regIds.concat(identityDB.devices.gcm);

            done();
        });
    }, function(err) {

        if (err) {

            log.error('Error iterating on identity ids', err);
            return callback(err);
        }

        var sent = {
            "GCM": [],
            "APN": []
        };

        async.parallel([

            function(done) {

                if ( onlyGcm ) {

                    log.info('Sending PUSH to GCM');
                    log.debug('Sending PUSH to GCM', regIds);

                    sent.GCM = sent.GCM.concat(regIds);

                    gcm.sendGCM(regIds, data, {}, done);
                } else {

                    done();
                }
            },
            function(done) {

                if ( onlyApn ) {

                    log.info('Sending PUSH to APN');
                    log.debug('Sending PUSH to APN', deviceTokens);

                    sent.APN = sent.APN.concat(deviceTokens);

                    apn.pushNotification(deviceTokens, data, body, done);
                } else {

                    done();
                }
            }
        ], function(err){

            if (err) {

                log.error('Error sending push notifications', err);
                return callback(err);
            }

            log.info('Push notifications sent');
            log.debug('Push notifications sent', sent);

            return callback(null, sent);
        });
    });
}

function deleteApnDevices(devices, callback){

    log.info('Deleting Apn devices');
    log.debug('Deleting Apn devices', devices);

    async.forEachSeries(devices, function(device, done){

        Identity.update({'devices.apn':{$in:[device]}}, {$pull:{'devices.apn':device}}, done);
    }, function(err){

        if (err) {

            log.error('Error deleting apn devices', err);
            return callback(err);
        }

        callback(null);
    });
}