var Identity = require('../models/identity');
var Channel = require('../models/channel');
var _ = require('lodash');
var config = require('config');
var async = require('async');
var log = require('../util/logger');
var errors = require('../util/errors');

module.exports = {
  get: getIdentity,
  find: findIdentities,
  update: updateIdentities,
  count: countIdentities,
  formatIdentity: formatIdentity,
  updateIdentityData: updateIdentityData,
  preProcessIdentity: preProcessIdentity,
  createIdentity: createIdentity,
  checkForIdentityExistence: checkForIdentityExistence,
  removeValuesFromField: removeValuesFromField,
  findIdentitiesByFieldValue: findIdentitiesByFieldValue,
  subscribeIdentityToChannels: subscribeIdentityToChannels
};

function getIdentity(id, callback) {
  Identity.findById(id, callback);
}

function findIdentities(conditions, projection, options, callback) {
  Identity.find(conditions, projection, options, callback);
}

function updateIdentities(conditions, projection, options, callback) {
  Identity.update(conditions, projection, options, callback);
}

function countIdentities(conditions, callback) {
  Identity.count(conditions, callback);
}

function formatIdentity(identityObject) {

  var formattedIdentity = {};

  formattedIdentity.id = identityObject._id;
  formattedIdentity.channels = _.clone(identityObject.channels);
  formattedIdentity.devices = _.clone(identityObject.devices);

  return formattedIdentity;
}

function updateIdentityData(identity, changes, callback) {

  log.info('Updating Identity Data');
  log.debug('Updating Identity Data', identity, changes);

  checkForIdentityExistence(identity, function(err, result) {

    if (err) {
      return callback(err);
    }

    async.waterfall([
      function performUpdate(done) {

        var editedIdentity = preProcessIdentity(result, changes);
        identity.set(editedIdentity);
        identity.save(function(err){

          if (err) {
            return done(err);
          }

          return done();
        });
      },
      function updateSubscriptions(done) {
        subscribeIdentityToChannels(identity.id, identity.channels, function(err, output) {

          if (err) {
            return done(err);
          }

          return done(null, output);
        });
      }
    ],
    function (err, output) {

     if (err) {
       return callback(err);
     }

      return callback(null, output);
    });
  });
}

function preProcessIdentity(identity, changes) {

  var merged;

  if (!identity) {

    identity = {
      channels: [],
      devices: {
        sms: [],
        phone: [],
        email: [],
        apn: [],
        gcm: []
      }
    };

  }

  merged = _.extend({}, identity, changes);

  log.info('Preprocessing identity data');
  log.debug('Preprocessing identity data', merged);

  return merged;
}

function createIdentity(identityObj, callback) {

  var element = preProcessIdentity(null, identityObj);

  async.waterfall([
    function createNewIdentity(done) {
      checkForIdentityExistence(element, function(err) {

        if (err) {
          return done(err);
        }

        return done();
      });
    },
    function saveNewIdentity(done) {

      var identity = new Identity(element);

      log.info('Saving new identity');
      log.debug('Saving new identity', identity);

      identity.save(function(err, savedIdentity) {

        if (err) {
          return done(err);
        }

        return done(null, savedIdentity);
      });
    },
    function subscribeToChannels(savedIdentity, done) {

      subscribeIdentityToChannels(savedIdentity.id, savedIdentity.channels, function(err, subscribedIdentity) {

        if (err) {
          return done(err);
        }

        return done(null, subscribedIdentity);
      });
    }
  ], function finishSubscription(err, subscribedIdentity) {

    if (err) {
      return callback(err);
    }

    return callback(null, subscribedIdentity);
  });
}

function checkForDuplicates(identity, field, callback) {

  /* Find any identity whose property given by field contains any of the to-be-created identity property values */
  var fieldValuesToCheck = _.get(identity, field);
  Identity.find().where(field).in(fieldValuesToCheck).exec(function(err, result) {

    if (err) {
      return callback(err);
    }

    var duplicatedIdentities =_.filter(result, function(item) {
      return item.id !== identity.id;
    });

    log.info('Checking for duplicates');
    log.debug('Checking for duplicates', duplicatedIdentities);

    if (!_.isEmpty(duplicatedIdentities)) {
      return callback(null, true);
    }

    return callback(null, false);
  });
}

function checkForIdentityExistence(identityObj, callback) {

  if (!identityObj) {
    return callback(new errors.BadRequestError('Cannot check a missing identity object'));
  }

  var mustCheck = {};

  _.forEach(config.get('uniqueness.devices'), function(item) {
    mustCheck[item] = true;
  });


  async.parallel({
    email: function(done) {
      if (!mustCheck.email || _.isEmpty(identityObj.devices.email)) {
        return done(null, false);
      }
      checkForDuplicates(identityObj, 'devices.email', done);
    },
    sms: function(done) {
      if (!mustCheck.sms || _.isEmpty(identityObj.devices.sms)) {
        return done(null, false);
      }
      checkForDuplicates(identityObj, 'devices.sms', done);
    },
    phone: function(done) {
      if (!mustCheck.phone || _.isEmpty(identityObj.devices.phone)) {
        return done(null, false);
      }
      checkForDuplicates(identityObj, 'devices.phone', done);
    },
    gcm: function(done) {
      if (!mustCheck.gcm || _.isEmpty(identityObj.devices.gcm)) {
        return done(null, false);
      }
      checkForDuplicates(identityObj, 'devices.gcm', done);
    },
    apn: function(done) {
      if (!mustCheck.apn || _.isEmpty(identityObj.devices.apn)) {
        return done(null, false);
      }
      checkForDuplicates(identityObj, 'devices.apn', done);
    }
  }, function(err, result) {

    var isValid = _.every(result, function(element) {
      return element === false;
    });

    if (err) {
      return callback(err);
    }

    if (!isValid) {
      return callback(new errors.ConflictError('There already exists an identity object with some of the provided field values'));
    }

    return callback(null, identityObj);
  });
}

function removeValuesFromField(identityList, field, valuesToRemove, callback) {

  var queryOptions = {};

  if (identityList) {
    var valuesToRemoveToArray = _.isArray(identityList) ? identityList : [identityList];
    queryOptions._id = { $in: valuesToRemoveToArray };
  }

  var pullOptions = {};
  pullOptions[field] = valuesToRemove;

  Identity.update(queryOptions, { $pull: pullOptions}, {multi: true}, function(err, result) {

    if (err) {
      return callback(new InternalError('Could not update identities for field ' + field));
    }

    return callback(null, result);
  });
}

function findIdentitiesByFieldValue(field, values, callback) {

  Identity.find().where(field).in(values).exec(function(err, foundIdentities) {

    if (err) {
      return callback(new errors.InternalError('Could not find identities for field ' + field + ' and values ' + values));
    }

    return callback(err, foundIdentities);
  });
}

function subscribeIdentityToChannels(subscribedIdentity, channelNames, callback) {

  async.waterfall([
    function searchChannels(done) {
      Channel.find({'name': {$in: channelNames}}, function(err, foundChannels) {

        if (err) {
          return done(err);
        }

        var filteredChannelNames = _.flatten(_.map(foundChannels, function(channelItem) {
          return channelItem.name;
        }));

        return done(null, filteredChannelNames );
      });
    },
    function performSubscription(filteredChannelNames , done) {
      async.parallel({
        pushIdentityToChannel: function(microDone) {
          Channel.update({'name': {$in: filteredChannelNames  }}, {$push: {'identityRef': subscribedIdentity}}, null, function(err) {

            if (err) {
              return microDone(err);
            }

            return microDone();
          });
        },
        pushChannelNameToIdentity: function(microDone) {
          Identity.update({'_id': subscribedIdentity}, {$set: { 'channels': filteredChannelNames }}, null, function(err) {

            if (err) {
              return microDone(err);
            }

            return microDone();
          });
        }
      }, done);
    }
  ], function(err) {

    if (err) {
      return callback(err);
    }

    return callback(null, subscribedIdentity);
  });
}
