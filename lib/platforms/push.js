var async = require('async');
var config = require('config');
var _ = require('lodash');
var gcm = require('../transport/gcm');
var apn = require('../transport/apn');
var Identity = require('../models/identity');
var log = require('../util/logger');

var APN_BATCH_LIMIT = config.get('platform_batch_limits.apn');
var GCM_BATCH_LIMIT = config.get('platform_batch_limits.gcm');
var CUSTOM_APN_BATCH_LIMIT = config.get('transport.apn');
var CUSTOM_GCM_BATCH_LIMIT = config.get('transport.gcm.batch_limit');

function sendApnPush(identities, body, callback) {

  var apnDevices = _.flatten(_.map(identities, function(identityItem) {
    return identityItem.devices.apn;
  }));

  var alert = body.content.apn.alert;

  log.info('Sending PUSH to APN');
  log.debug('Sending PUSH to APN', apnDevices);

  apn.pushNotification(apnDevices, alert, body.content.apn, callback);
}

function sendGcmPush(identities, body, callback) {

  var gcmDevices = _.flatten(_.map(identities, function(identityItem) {
    return identityItem.devices.gcm;
  }));

  var data = body.content.gcm.message;

  gcm.sendGCM(gcmDevices, data, {}, callback);
}

function deleteApnDevices(devices, callback){

    log.info('Deleting Apn devices');
    log.debug('Deleting Apn devices', devices);
    async.forEachSeries(devices, function(device, done){
        Identity.update({'devices.apn':{$in:[device]}}, {$pull:{'devices.apn':device}}, function (err) {

          if (err) {
            return done(err);
          }
          return done();
        });
    }, function(err){

        if (err) {
            return callback(err);
        }

        callback(null);
    });
}

var apnOptions = {
  resourceName: 'devices.apn',
  batchLimit: _.min([APN_BATCH_LIMIT, CUSTOM_APN_BATCH_LIMIT]),
  projectionOptions: {'devices.apn': 1}
};

var gcmOptions = {
  resourceName: 'devices.gcm',
  batchLimit: _.min([GCM_BATCH_LIMIT, CUSTOM_GCM_BATCH_LIMIT]),
  projectionOptions: {'devices.gcm': 1}
};

module.exports = {
  sendApn: sendApnPush,
  sendGcm: sendGcmPush,
  deleteApnDevices: deleteApnDevices,
  options: {
    apn: apnOptions,
    gcm: gcmOptions
  }
};