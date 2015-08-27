var async = require('async');
var _ = require('lodash');
var log = require('../util/logger');
var identityPlatform = require('./identity');
var errors = require('../util/errors');

module.exports = {
  sendNotification: sendNotification,
  sendPushNotifications: sendPushNotifications
};

function sendNotification(requestBody, platformModule, callback) {

  var targetChannels = requestBody.channels;
  var targetIdentities = requestBody.identities;

  var queryOptions = buildQueryOptions({
    identities: targetIdentities,
    channels: targetChannels,
    resource: platformModule.options.resourceName
  });

  batchNotifications(requestBody, platformModule, queryOptions, callback);
}

function sendPushNotifications(requestBody, platformModule, callback) {

  var targetChannels = requestBody.channels;
  var targetIdentities = requestBody.identities;

  var apnQueryOptions = buildQueryOptions({
    identities: targetIdentities,
    channels: targetChannels,
    resource: platformModule.options.apn.resourceName
  });

  var gcmQueryOptions = buildQueryOptions({
    identities: targetIdentities,
    channels: targetChannels,
    resource: platformModule.options.gcm.resourceName
  });

  var queryOptions = {
    apn: apnQueryOptions,
    gcm: gcmQueryOptions
  };

  var sendFlags = {
    apn: !_.isEmpty(requestBody.content.apn),
    gcm: !_.isEmpty(requestBody.content.gcm)
  };

  async.parallel({
    sendApnBatch: function(done) {
      if (!sendFlags.apn) {
        return done();
      }
      batchNotifications(requestBody, {send: platformModule.sendApn, options: platformModule.options.apn}, queryOptions.apn, done);
    },
    sendGcmBatch: function(done) {
      if (!sendFlags.gcm) {
        return done();
      }
      batchNotifications(requestBody, {send: platformModule.sendGcm, options: platformModule.options.gcm}, queryOptions.gcm, done);
    }
  }, function(err) {

    if (err) {
      return callback(err); // Controlled error
    }

    return callback(null, {response: 'Queued', body: {output: 'Queued notifications' } });
  });
}

function batchNotifications(requestBody, platformModule, queryOptions, callback) {

  async.waterfall([
    function countNumberOfIdentities(done) {
      countIdentities(queryOptions, done);
    },
    function sendPlatformNotifications(queryOptions, totalIdentities, done) {
      sendBatches(requestBody, queryOptions, totalIdentities, platformModule, done);
    }
  ], function(err) {

    if (err) {
      return callback(new errors.InternalError('Batch notifications process failed for request ' + requestBody));
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

    if (err) {
      return done(new errors.InternalError('Could not obtain number of identity objects'));
    }

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
          return nextBatch(new errors.InternalError('Could not find identity objects for batch %d', page));
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
            return nextBatch(new errors.InternalError('Fatal error while sending notifications batch'));
          }

          return nextBatch();
        });
      });
  }, done);
}