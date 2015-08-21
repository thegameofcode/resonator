var gcm = require('node-gcm');
var config = require('config');
var log = require('../util/logger');

function sendGCM(regIds, data, options, callback) {

  // Create a message with default values
  var message = new gcm.Message();

  var sender = new gcm.Sender(config.get('transport.gcm.googleApiKey'));

  var registrationIds = [];

  // Add a data object
  message.addData(data);

  if (options) {
    message.collapseKey = options.collapseKey;
    message.delayWhileIdle = options.delayWhileIdle;
    message.timeToLive = options.timeToLive;
    message.dryRun = options.dryRun;
  }

  // At least one required
  registrationIds = registrationIds.concat(regIds);

  /**
   * Params: message-literal, registrationIds-array, No. of retries, callback-function
   **/
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
