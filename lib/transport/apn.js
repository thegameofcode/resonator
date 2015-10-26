'use strict';
const log = require('../util/logger');
const apn = require('apn');
const path = require('path');
const config = require('config');
const apnPlatform = require('../platforms/push');
let apnConnection;
let feedbackConnection;

const pfxPath = path.join( __dirname, '../apn/' + config.get('transport.apn.pfx'));

function startApnConnection(apnConnection) {

  apnConnection.on('connected', function(openSockets) {
    log.info('APN connected openSockets[' + openSockets + ']');
  });

  apnConnection.on('timeout', function() {
    log.info('APN timeout');
  });

  apnConnection.on('transmitted', function(notification, device) {
    log.info('APN transmitted device[' + device + '] compiledPayload[' + notification.compiledPayload + ']');
  });

  apnConnection.on('completed', function() {
    log.info('APN completed');
    apnConnection.shutdown();
  });

  apnConnection.on('transmissionError', function(errorCode, notification, device) {
    log.error('[' + new Date() + '] APN transmissionError errorCode[' + errorCode + '] device[' + device + '] compiledPayload[' + notification.compiledPayload + ']');
  });
}

function pushNotification(apnConnection, deviceTokens, alert, data, callback) {

  let devices = [];
  try {
    if ( Array.isArray(deviceTokens) ) {
      deviceTokens.forEach(function(device) {
        devices.push( new apn.Device(device) );
      });
    }

  } catch (exception) {
    log.error(exception);
  }

  if (devices.length > 0) {

    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + config.get('transport.apn.notificationExpiry');
    note.alert = alert;
    note.payload = data;
    // note.badge = 1; h
    // note.sound = "ping.aiff";

    devices.forEach(function(device) {
      apnConnection.pushNotification(note, device);
    });
  }

  if ( callback ) {
    callback(null);
  }
}

function startFeedbackService(feedbackConnection) {

  feedbackConnection.on('feedback', function(feedbackData) {
    let devices = [];

    feedbackData.forEach(function(feedbackItem) {
      devices.push( feedbackItem.device.token.toString('hex') );
    });

    if (devices.length > 0) {
      log.info('Remove ' + devices.length + ' devices');
      apnPlatform.deleteApnDevices(devices, function() {
        log.info('Remove done');
      });
    }
  });

  feedbackConnection.on('error', function(error) {
    log.error('Feedback conn error:', error);
  });

  feedbackConnection.on('feedbackError', function(error) {
    log.error('Feedback error:', error);
  });
}

function connect() {

  if (apnConnection && feedbackConnection) {
    return apnConnection;
  }

  apnConnection = new apn.Connection({
    production: config.get('transport.apn.production'),
    passphrase: config.get('transport.apn.passphrase'),
    pfx: pfxPath
  });

  feedbackConnection = new apn.Feedback({
    production: config.get('transport.apn.production'),
    passphrase: config.get('transport.apn.passphrase'),
    interval: config.get('transport.apn.feedbackInterval'),
    pfx: pfxPath
  });

  startApnConnection(apnConnection);
  startFeedbackService(feedbackConnection);

  return apnConnection;
}

module.exports = {
  pushNotification: pushNotification,
  connect: connect
};
