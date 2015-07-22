var Identity = require('../models/identity');
var _ = require('lodash');
var config = require('config');
var async = require('async');

module.exports = {
  get: getIdentity,
  retrieveIdentityData: retrieveIdentityData,
  formatIdentity: formatIdentity,
  updateIdentityData: updateIdentityData,
  preProcessIdentity: preProcessIdentity,
  createIdentity: createIdentity,
  checkForIdentityExistence: checkForIdentityExistence
};

function getIdentity(id, callback) {
  Identity.findById(id, callback);
}

function retrieveIdentityData(id, callback) {

  getIdentity(id, function(err, foundIdentity) {

    if (err) {
      return callback(err);
    }

    var identity = formatIdentity(foundIdentity);

    return callback(identity);
  });
}

function formatIdentity(identityObject) {

  var formattedIdentity = {};

  formattedIdentity.id = identityObject._id;
  formattedIdentity.channels = _.clone(identityObject.channels);
  formattedIdentity.devices = _.clone(identityObject.devices);

  return formattedIdentity;
}

function updateIdentityData(identity, changes, callback) {

  var editedIdentity = preProcessIdentity(identity, changes);
  identity.set(editedIdentity);
  identity.save(callback);
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
  return merged;
}

function createIdentity(identityObj, callback) {

  var element = preProcessIdentity(null, identityObj);

  checkForIdentityExistence(element, function(err) {

    if (err) {
      return callback(true);
    }
    var identity = new Identity(element);
    identity.save(callback);
  });
}

function checkForDuplicates(identity, field, callback) {

  /* Find any identity whose property given by field contains any of the to-be-created identity property values */
  var fieldValuesToCheck = _.get(identity, field);
  Identity.find().where(field).in(fieldValuesToCheck).exec(function(err, results) {

    if (err) {
      return callback(err);
    }

    if (!_.isEmpty(results)) {
      return callback(null, true);
    }
    return callback(null, false);
  });
}

function checkForIdentityExistence(identityObj, callback) {

  if (!identityObj) {
    return callback(true);
  }

  var mustCheck = {};

  _.forEach(config.get('uniqueness.devices'), function(item) {
    mustCheck[item] = true;
  });

  var uniqueChannels = config.get('uniqueness.channels');

  async.parallel({
    channels: function(done) {
      if (!uniqueChannels || _.isEmpty(identityObj.channels)) {
        return done(null, false);
      }
      checkForDuplicates(identityObj, 'channels', done);
    },
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

    if (err || !isValid) {
      return callback(true);
    }

    return callback(null, identityObj);
  });
}