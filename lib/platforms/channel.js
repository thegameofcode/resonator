var Channel = require('../models/channel');
var identities = require('../platforms/identity');
var _ = require('lodash');
var async = require('async');

module.exports = {
  get: getChannel,
  retrieveChannelDataForIdentity: retrieveChannelDataForIdentity,
  createChannel: createChannel,
  deleteChannel: deleteChannel,
  updateChannel: updateChannel,
  retrieveIdentityListForChannel: retrieveIdentityListForChannel,
  deleteIdentityFromChannel: deleteIdentityFromChannel,
  removeValuesFromField: removeValuesFromField
};

function getChannel(id, callback) {
  Channel.findById(id, callback);
}

function retrieveChannelDataForIdentity(identity, callback) {

  identities.get(identity, function(err, foundIdentity) {

    if (err || !foundIdentity) {
      return callback(true);
    }

    Channel.find().where('_id').in(foundIdentity.channels).exec(function(err, foundChannels) {

      if (err) {
        return callback(true);
      }

      var channelData = [];

      _.forEach(foundChannels, function(channel) {
        channelData.push({
          id: channel.id,
          name: channel.name
        });
      });

      return callback(null, channelData);
    });
  });
}

function createChannel(channelData, callback) {

  Channel.findOne({name: channelData.name}, function(err, results) {

    if (results && !_.isEmpty(results)) {
      return callback(true);
    }

    var formattedChannel = preProcessChannel(null, channelData);

    var channel = new Channel(formattedChannel);

    channel.save(function(err, savedChannel) {

      if (err) {
        return callback(true);
      }

      return callback(null, savedChannel);
    });
  });
}

function preProcessChannel(channelToProcess, changes) {

  var merged;

  if (!channelToProcess) {

    channelToProcess = {
      name: ""
    };

  }

  merged = _.extend({}, channelToProcess, changes);
  return merged;
}

function deleteChannel(channelId, callback) {

  if (!channelId) {
    return callback(true);
  }

  Channel.findOneAndRemove({'_id': channelId}, function(err, deletedChannel) {

    if (err || !deletedChannel) {
      return callback(true);
    }

    var relatedIdentities = deletedChannel.identityRef;

    if (_.isEmpty(relatedIdentities)) {
      return callback();
    }

    identities.removeValuesFromField(deletedChannel.identityRef, 'channels', deletedChannel.id, function(err) {

      if (err) {
        return callback(true);
      }

      return callback();
    });
  });
}

function updateChannel(channelId, changes, callback) {

  getChannel(channelId, function(err, foundChannel) {

    if (err || !foundChannel) {
      return callback(true);
    }

    var formattedChannel = preProcessChannel(foundChannel, changes);

    foundChannel.set(formattedChannel);
    foundChannel.save(foundChannel, function(err, saveResult) {

      if (err) {
        return callback(true);
      }

      return callback(null, saveResult);
    });
  });
}

function retrieveIdentityListForChannel(channelId, callback) {

  if (!channelId) {
    return callback(true);
  }

  getChannel(channelId, function(err, foundChannel) {

    if (err || !foundChannel) {
      return callback(true);
    }

    if (_.isEmpty(foundChannel.identityRef)) {
      return callback(null, []);
    }

    identities.findIdentitiesByFieldValue('_id', foundChannel.identityRef, function(err, foundIdentities) {

      if (err || !foundIdentities) {
        return callback(true);
      }

      var identityList = [];

      _.forEach(foundIdentities, function(identity) {
        identityList.push(identities.formatIdentity(identity));
      });

      return callback(null, identityList);
    });
  });
}

function deleteIdentityFromChannel(channelId, identityId, callback) {

  identities.get(identityId, function(err, foundIdentity) {

    if (err || !foundIdentity) {
      return callback(true);
    }

    async.parallel({
      deleteIdentityIdFromChannel: function(done) {
        removeValuesFromField(channelId, 'identityRef', identityId, done);
      },
      deleteChannelIdFromIdentity: function(done) {
        identities.removeValuesFromField(identityId, 'channels', channelId, done);
      }
    }, function(err) {

      if (err) {
        return callback(err);
      }

      return callback();
    });
  });
}

function removeValuesFromField(channelList, field, valuesToRemove, callback) {

  var queryOptions = {};

  if (channelList) {
    var valuesToRemoveToArray = _.isArray(channelList) ? channelList : [channelList];
    queryOptions._id = { $in: valuesToRemoveToArray };
  }

  var pullOptions = {};
  pullOptions[field] = valuesToRemove;

  Channel.update(queryOptions, { $pull: pullOptions}, {multi: true}, function(err, result) {

    if (err || result.nModified === 0) {
      return callback(true);
    }

    return callback(null, result);
  });
}