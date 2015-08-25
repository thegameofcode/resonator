var Channel = require('../models/channel');
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
      return callback(new Error('Could not find Identity object'));
    }

    Channel.find().where('name').in(foundIdentity.channels).exec(function(err, foundChannels) {

      if (err) {
        return callback(err);
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

    if (err) {
      return callback(err);
    }
    if (results && !_.isEmpty(results)) {
      return callback(new Error('There already exists a channel with the provided name'));
    }

    var formattedChannel = preProcessChannel(null, channelData);

    var channel = new Channel(formattedChannel);

    channel.save(function(err, savedChannel) {

      if (err) {
        return callback(err);
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
    return callback(new Error('Missing channel id parameter'));
  }

  Channel.findOneAndRemove({'_id': channelId}, function(err, deletedChannel) {

    if (err) {
      return callback(err);
    }

    if (!deletedChannel) {
      return callback(new Error('Requested channel not found in database'));
    }

    var relatedIdentities = deletedChannel.identityRef;

    if (_.isEmpty(relatedIdentities)) {
      return callback();
    }

    identities.removeValuesFromField(deletedChannel.identityRef, 'channels', deletedChannel.name, function(err) {

      if (err) {
        return callback(err);
      }

      return callback();
    });
  });
}

function updateChannel(channelId, changes, callback) {

  var oldChannel;
  async.waterfall([
    function updateChannelContent(done) {
      getChannel(channelId, function(err, foundChannel) {

        if (err) {
          return done(err);
        }

        if (!foundChannel) {
          return done(new Error('Requested Channel object not found in database'));
        }

        oldChannel = _.clone(foundChannel.toObject());
        var formattedChannel = preProcessChannel(foundChannel, changes);

        foundChannel.set(formattedChannel);
        foundChannel.save(foundChannel, function(err, updatedChannel) {

          if (err) {
            return done(err);
          }

          return done(null, oldChannel, updatedChannel);
        });
      });
  },
    function updateIdentitiesChannelContents(oldChannel, updatedChannel, done) {

      identities.update({'channels': oldChannel.name}, {$set: { 'channels.$': updatedChannel.name}}, {multi: true}, function(err) {

        if (err) {
          return done(err);
        }
        return done();
      });
    }
  ], function(err) {

    if (err) {
      return callback(err);
    }

    return callback();
  });
}

function retrieveIdentityListForChannel(channelId, callback) {

  if (!channelId) {
    return callback(new Error('Missing channel id parameter'));
  }

  getChannel(channelId, function(err, foundChannel) {

    if (err) {
      return callback(err);
    }

    if (!foundChannel) {
      return callback(new Error('Requested Channel object not found in database'));
    }

    if (_.isEmpty(foundChannel.identityRef)) {
      return callback(null, []);
    }

    identities.findIdentitiesByFieldValue('_id', foundChannel.identityRef, function(err, foundIdentities) {

      if (err) {
        return callback(err);
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

  async.waterfall([
    function findChannel(done) {
      getChannel(channelId, function(err, foundChannel) {

        if (err) {
          return done(err);
        }

        if (_.isEmpty(foundChannel)) {
          return done(new Error('Requested Channel object not found in database'));
        }

        return done(null, foundChannel);
      });
    },
    function findIdentity(channel, done) {

      identities.get(identityId, function(err, foundIdentity) {

        if (err) {
          return done(err);
        }

        if (_.isEmpty(foundIdentity)) {
          return done(new Error('Requested Identity object not found in database'));
        }

        return done(null, channel, foundIdentity);
      });
    },
    function checkAssociations(channel, identity, done) {

      var identityHasChannel = _.some(identity.channels, function(channelItem) {
        return channelItem == channel.name;
      });

      var channelHasIdentity = _.some(channel.identityRef, function(identityItem) {
        return identityItem.toString() == identity.id;
      });

      if (!identityHasChannel || !channelHasIdentity) {
        return done(new Error('No relationship exist between the provided Channel and Identity objects'));
      }

      return done(null, channel, identity);
    },
    function deleteIdentityFromChannel(channel, identity, done) {

      async.parallel({
        deleteIdentityIdFromChannel: function(microDone) {
          removeValuesFromField(channelId, 'identityRef', identityId, microDone);
        },
        deleteChannelIdFromIdentity: function(microDone) {
          identities.removeValuesFromField(identityId, 'channels', channel.name, microDone);
        }
      }, done);

    }], callback);
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

    if (err) {
      return callback(err);
    }

    return callback(null, result);
  });
}

var identities = require('../platforms/identity');
