'use strict';
const async = require('async');
const _ = require('lodash');
const log = require('../util/logger');
const identityPlatform = require('./identity');

function buildQueryOptions(options) {

  let andConditionOne = {};
  andConditionOne[options.resource] = {$ne: null};

  let orConditionOne = { _id: { $in: options.identities}};
  let orConditionTwo = { channels: { $in: options.channels}};

  let orCondition = {$or: [orConditionOne, orConditionTwo]};

  let buildOptions;

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
      return done(err);
    }

    log.info('Counted ' + numIdentities + ' identities');
    return done(null, queryOptions, numIdentities);
  });
}

function sendBatches(requestBody, queryOptions, totalIdentities, platformModule, done) {

  let processNextBatch = true;
  let page = 0;
  let pageSize = platformModule.options.batchLimit;
  let offset = page * pageSize;

  async.whilst(function batcher() {

    return processNextBatch;

  }, function searchAndSend(nextBatch) {

    identityPlatform.find(queryOptions,
      platformModule.options.projectionOptions, {skip: offset, sort: 'ts'}, function(err, foundIdentities) {

        log.info('batch %d found identities %s', page, foundIdentities);

        if (err) {
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
            return nextBatch(err);
          }

          return nextBatch();
        });
      });
  }, done);
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
      return callback(err);
    }

    return callback(null, {response: 'Queued', body: {output: 'Queued notifications'}});
  });
}

function sendNotification(requestBody, platformModule, callback) {

  const targetChannels = requestBody.channels;
  const targetIdentities = requestBody.identities;

  let queryOptions = buildQueryOptions({
    identities: targetIdentities,
    channels: targetChannels,
    resource: platformModule.options.resourceName
  });

  batchNotifications(requestBody, platformModule, queryOptions, callback);
}

function sendPushNotifications(requestBody, platformModule, callback) {

  const targetChannels = requestBody.channels;
  const targetIdentities = requestBody.identities;

  let apnQueryOptions = buildQueryOptions({
    identities: targetIdentities,
    channels: targetChannels,
    resource: platformModule.options.apn.resourceName
  });

  let gcmQueryOptions = buildQueryOptions({
    identities: targetIdentities,
    channels: targetChannels,
    resource: platformModule.options.gcm.resourceName
  });

  let queryOptions = {
    apn: apnQueryOptions,
    gcm: gcmQueryOptions
  };

  let sendFlags = {
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
      return callback(err);
    }

    return callback(null, {response: 'Queued', body: {output: 'Queued notifications' } });
  });
}

module.exports = {
  sendNotification: sendNotification,
  sendPushNotifications: sendPushNotifications,
  buildQueryOptions: buildQueryOptions
};
