var Identity = require('../models/identity');
var _ = require('lodash');
var config = require('config');
var async = require('async');
var log = require('../util/logger');

module.exports = {
  get: getIdentity,
  retrieveIdentityData: retrieveIdentityData,
  formatIdentity: formatIdentity,
  updateIdentityData: updateIdentityData,
  preProcessIdentity: preProcessIdentity,
  createIdentity: createIdentity,
  checkForIdentityExistence: checkForIdentityExistence,
  removeValuesFromField: removeValuesFromField,
  findIdentitiesByFieldValue: findIdentitiesByFieldValue
};

function getIdentity(id, callback) {
  Identity.findById(id, callback);
}

function retrieveIdentityData(id, callback) {

  log.info('Retrieving identity data');
  log.debug('Retrieving identity data', id);

  getIdentity(id, function(err, foundIdentity) {

    if (err) {

      log.error('Error getting the identity id', err);
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

  log.info('Updating Identity Data');
  log.debug('Updating Identity Data', identity, changes);

  checkForIdentityExistence(identity, function(err, result) {

    if (err) {

      log.error('Error checking the id existence', err);
      return callback(err);
    }

    var editedIdentity = preProcessIdentity(result, changes);
    identity.set(editedIdentity);
    identity.save(function(err){

      if (err) {

        log.error('Error saving identity', err);
        return callback(err);
      }

      return callback();
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

  checkForIdentityExistence(element, function(err) {

    if (err) {

      log.error('Error checking the identity existence', err);
      return callback(err);
    }

    var identity = new Identity(element);

    log.info('Saving new identity');
    log.debug('Saving new identity', identity);

    identity.save(function(err, savedIdentity) {

      if (err) {

        log.error('Error saving the identity', err);
        return callback(err);
      }

      return callback(null, savedIdentity);
    });
  });
}

function checkForDuplicates(identity, field, callback) {

  /* Find any identity whose property given by field contains any of the to-be-created identity property values */
  var fieldValuesToCheck = _.get(identity, field);
  Identity.find().where(field).in(fieldValuesToCheck).exec(function(err, result) {

    if (err) {

      log.error('Error checking for duplicates', err);
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
    return callback(true);
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

    if (err || !isValid) {
      return callback(true);
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

    if (err || result.nModified === 0) {
      return callback(true);
    }

    return callback(null, result);
  });
}

function findIdentitiesByFieldValue(field, values, callback) {

  Identity.find().where(field).in(values).exec(function(err, foundIdentities) {

    if (err) {
      return callback(err);
    }

    return callback(err, foundIdentities);
  });
}