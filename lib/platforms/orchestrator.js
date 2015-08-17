var async = require('async');
var log = require('../util/logger');
var identityPlatform = require('./identity');

module.exports = {
  sendNotification: sendNotification
};

function sendNotification(requestBody, platformModule, callback) {

  var targetChannels = requestBody.channels;
  var targetIdentities = requestBody.identities;

  var queryOptions = buildQueryOptions({
    identities: targetIdentities,
    channels: targetChannels,
    resource: platformModule.options.resourceName
  });

  async.waterfall([
    function countNumberOfIdentities(done) {
      countIdentities(queryOptions, done);
    },
    function sendPlatformNotifications(queryOptions, totalIdentities, done) {
      sendBatches(requestBody, queryOptions, totalIdentities, platformModule, done);
    }
  ], function(err) {

    if (err) {
      log.error('Sending notifications failed', err);
      return callback(err);
    }

    return callback(null, {response: 'Queued', body: {output: 'Queued notifications' } });
  });
}

function buildQueryOptions(options) {

  var andConditionOne = {};
  andConditionOne[options.resource] = {$ne: null};

  var orConditionOne = { _id: { $in: options.identities}};
  var orConditionTwo = { channels: { $in: options.channels}};

  var orCondition = {$or: [orConditionOne, orConditionTwo]};

  var buildOptions;

  if (!options.identities) {
    buildOptions = {$and: [orConditionTwo, andConditionOne] };
  } else if (!options.channels) {
    buildOptions = {$and: [orConditionOne, andConditionOne] };
  } else {
    buildOptions = {$and: [orCondition, andConditionOne]};
  }

  return buildOptions;
}

function countIdentities(queryOptions, done) {
  identityPlatform.count(queryOptions, function(err, numIdentities) {

    log.info('Counted ' + numIdentities + ' identities');
    return done(null, queryOptions, numIdentities);
  });
}

function sendBatches(requestBody, queryOptions, totalIdentities, platformModule, done) {

  var processNextBatch = true;
  var page = 0; //Start with first page
  var pageSize = platformModule.options.batchLimit;
  var offset = page * pageSize;

  async.whilst(function batcher() {

    return processNextBatch;

  }, function searchAndSend(nextBatch) {

    identityPlatform.find(queryOptions,
      platformModule.options.projectionOptions, {skip: offset, sort: 'ts'}, function(err, foundIdentities) {

        log.info('batch %d found identities %s', page, foundIdentities);

        if (err) {
          log.error('Fatal error while searching for identities to send notifications');
          return nextBatch(err);
        }

        if (foundIdentities.length < pageSize || totalIdentities === (pageSize * (page + 1))) {
          processNextBatch = false;
        } else {
          page += 1;
          offset = (page) * pageSize;
        }

        platformModule.send(foundIdentities, requestBody, function(err) {
          log.info('Sending notifications');

          if (err) {
            log.error('Fatal error while sending notifications', err);
            return nextBatch(err);
          }

          return nextBatch();
        });
      });
  }, done);
}