'use strict';
const gcm = require('node-gcm');
const config = require('config');
const log = require('../util/logger');

function sendGCM(regIds, data, options, callback) {

  let message = new gcm.Message();

  let sender = new gcm.Sender(config.get('transport.gcm.googleApiKey'));

  let registrationIds = [];

  message.addData(data);
  if (options) {
    message.collapseKey = options.collapseKey;
    message.delayWhileIdle = options.delayWhileIdle;
    message.timeToLive = options.timeToLive;
    message.dryRun = options.dryRun;
  }

  registrationIds = registrationIds.concat(regIds);

  log.info('GCM sending to registrationIds[' + registrationIds + '] data[' + JSON.stringify(data) + ']...');
  sender.send(message, registrationIds, 1, function(err, result) {

    if (err) {
      log.error('GCM error:', err);
    } else {
      log.info('GCM sent registrationIds[' + regIds + '] data[' + JSON.stringify(data) + '] result[' + JSON.stringify(result) + ']');
    }

    if (callback) {
      callback(err, result);
    }
  });

}

module.exports = {
  sendGCM: sendGCM
};
