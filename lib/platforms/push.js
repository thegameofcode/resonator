'use strict';
const async = require('async');
const config = require('config');
const _ = require('lodash');
const gcm = require('../transport/gcm');

const apn = require('../transport/apn');
const Identity = require('../models/identity');
const log = require('../util/logger');

const APN_BATCH_LIMIT = config.get('platform_batch_limits.apn');
const GCM_BATCH_LIMIT = config.get('platform_batch_limits.gcm');
const CUSTOM_APN_BATCH_LIMIT = config.get('transport.apn');
const CUSTOM_GCM_BATCH_LIMIT = config.get('transport.gcm.batch_limit');

function sendApnPush(identities, body, callback) {

  const apnDevices = _.flatten(_.map(identities, function(identityItem) {
    return identityItem.devices.apn;
  }));

  const alert = body.content.apn.alert;

  log.info('Sending PUSH to APN');
  log.debug('Sending PUSH to APN', apnDevices);

  let conn = apn.connect();
  apn.pushNotification(conn, apnDevices, alert, body.content.apn, callback);
}

function sendGcmPush(identities, body, callback) {

  const gcmDevices = _.flatten(_.map(identities, function(identityItem) {
    return identityItem.devices.gcm;
  }));

  const data = body.content.gcm.message;

  gcm.sendGCM(gcmDevices, data, {}, callback);
}

function deleteApnDevices(devices, callback) {

  log.info('Deleting Apn devices');
  log.debug('Deleting Apn devices', devices);
  async.forEachSeries(devices, function(device, done) {
    Identity.update({'devices.apn': {$in: [device]}}, {$pull: {'devices.apn': device}}, function(err) {

      if (err) {
        return done(err);
      }

      return done();
    });
  }, function(err) {

    if (err) {
      return callback(err);
    }

    callback(null);
  });
}

const apnOptions = {
  resourceName: 'devices.apn',
  batchLimit: _.min([APN_BATCH_LIMIT, CUSTOM_APN_BATCH_LIMIT]),
  projectionOptions: {'devices.apn': 1}
};

const gcmOptions = {
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
