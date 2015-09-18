require('./../global_conf');

var expect = require('chai').expect;
var _ = require('lodash');

var identityPlatform = require('./../../lib/platforms/identity');
var buildQueryOptions = require('./../../lib/platforms/orchestrator').buildQueryOptions;
var loadFixtures = require('./../../scripts/load_fixtures');
var log = require('./../../lib/util/logger');

var TEST_FILES = './../sample_files/';

describe('Identity platform: ', function() {


  beforeEach(function(done) {
    log.debug('Loading fixtures');
    loadFixtures(done);
  });

  it('getIdentity successfully', function(done) {

    var identityId = '01f0000000000000003f0001';

    identityPlatform.get(identityId, function(error, foundIdentity) {
      expect(error).to.equal(null);
      expect(foundIdentity).to.not.equal(null);
      return done();
    });
  });

  it('getIdentity with CastError', function(done) {

    var identityId = 'aaaa';

    identityPlatform.get(identityId, function(error, foundIdentity) {
      expect(error.name).to.equal('CastError');
      expect(error.message).to.equal('Cast to ObjectId failed for value "' + identityId +'" at path "_id"');
      expect(foundIdentity).to.equal(undefined);
      return done();
    });
  });

  it('getIdentity for a non-existing Identity object', function(done) {

    var identityId = '01f0000000000000003f0020';

    identityPlatform.get(identityId, function(error, notFoundIdentity) {
      expect(error).to.equal(null);
      expect(notFoundIdentity).to.equal(null);
      return done();
    });
  });

  it('findIdentities successfully', function(done) {

    var queryOptions = buildQueryOptions({
      identities: ['01f0000000000000003f0001', '01f0000000000000003f0002'],
      channels: ['buddies'],
      resource: 'devices.email'
    });

    var projectionOptions = { 'devices.email': 1};

    identityPlatform.find(queryOptions, projectionOptions, {skip: 0, sort: 'ts'}, function(error, results) {
      expect(error).to.equal(null);
      expect(results.length).to.equal(3);
      return done();
    });
  });

  it('updateIdentities successfully', function(done) {

    var channels = {
      oldChannel: 'buddies',
      updatedChannel: 'family'
    };

    var numIdentities = 2;

    identityPlatform.update({'channels': channels.oldChannel}, {$set: { 'channels.$': channels.updatedChannel}}, {multi: true}, function(err, count) {
      expect(err).to.equal(null);
      expect(count.n).to.equal(numIdentities);

      identityPlatform.find({'channels': channels.updatedChannel}, {}, function(error, results) {
        expect(error).to.equal(null);
        expect(results.length).to.equal(numIdentities);
        return done();
      });
    });
  });

  it('countIdentities successfully', function(done) {

    var numIdentities = 3;

    identityPlatform.count({}, function(error, count) {
      expect(error).to.equal(null);
      expect(count).to.equal(numIdentities);
      return done();
    });
  });

  it('formatIdentity successfully', function(done) {

    var identityId = '01f0000000000000003f0001';

    identityPlatform.get(identityId, function(error, foundIdentity) {
      var formattedIdentity = identityPlatform.formatIdentity(foundIdentity);
      expect(error).to.equal(null);
      expect(foundIdentity).to.not.deep.equal(formattedIdentity);
      return done();
    });
  });

  it('updateIdentityData successfully', function(done) {

    var identityId = '01f0000000000000003f0001';

    identityPlatform.get(identityId, function(error, identityToUpdate) {
      expect(error).to.equal(null);
      expect(identityToUpdate).to.not.equal(undefined);

      var updates = _.clone(identityToUpdate.toObject());
      updates.devices.email = ['some@other.email.com'];

      identityPlatform.updateIdentityData(identityToUpdate, updates, function(error, updatedIdentityId) {
        expect(error).to.equal(null);
        expect(updatedIdentityId).to.equal(identityId);
        return done();
      });
    });
  });

  it('createIdentity successfully', function(done) {

    var newIdentity = require(TEST_FILES + 'Identity.json').valid;

    identityPlatform.createIdentity(newIdentity, function(error, createdIdentityId) {
      expect(error).to.equal(null);
      expect(createdIdentityId).to.not.equal(null);
      return done();
    });
  });

  it('createIdentity with errors for duplcated Identity', function(done) {

    var newIdentity = require(TEST_FILES + 'Identity.json').duplicated;

    identityPlatform.createIdentity(newIdentity, function(error, createdIdentityId) {
      expect(error.statusCode).to.equal(409);
      expect(error.body.code).to.equal('ConflictError');
      expect(error.body.message).to.equal('There already exists an identity object with some of the provided field values');
      expect(createdIdentityId).to.equal(undefined);
      return done();
    });
  });

  it('createIdentity without errors for a non-existing channel name', function(done) {

    var newIdentity = require(TEST_FILES + 'Identity.json').invalid_channel;

    identityPlatform.createIdentity(newIdentity, function(error, createdIdentityId) {
      expect(error).to.equal(null);
      expect(createdIdentityId).to.not.equal(undefined);
      return done();
    });
  });

  it('checkForIdentityExistence with duplicated output', function(done) {

    var newIdentity = require(TEST_FILES + 'Identity.json').duplicated;

    identityPlatform.checkForIdentityExistence(newIdentity, function(error, checkedIdentity) {
      expect(error.statusCode).to.equal(409);
      expect(error.body.code).to.equal('ConflictError');
      expect(error.body.message).to.equal('There already exists an identity object with some of the provided field values');
      expect(checkedIdentity).to.equal(undefined);
      return done();
    });
  });

  it('checkForIdentityExistence for empty identity', function(done) {

    identityPlatform.checkForIdentityExistence(undefined, function(error, checkedIdentity) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Cannot check a missing identity object');
      expect(checkedIdentity).to.equal(undefined);
      return done();
    });
  });

  it('checkForIdentityExistence with no-duplication output', function(done) {

    var newIdentity = require(TEST_FILES + 'Identity.json').valid;

    identityPlatform.checkForIdentityExistence(newIdentity, function(error, checkedIdentity) {
      expect(error).to.equal(null);
      expect(checkedIdentity).to.deep.equal(newIdentity);
      return done();
    });
  });

  it('removeValuesFromField successfully', function(done) {

    var identityId = '01f0000000000000003f0001';
    var channelName = 'buddies';

    identityPlatform.removeValuesFromField(identityId, 'channels', channelName, function(error, output) {
      expect(error).to.equal(null);
      expect(output.n).to.equal(1);
      expect(output.nModified).to.equal(1);
      return done();
    });
  });

  it('removeValuesFromField with errors', function(done) {

    var identityId = '01f0000000000000003f0004';
    var channelName = 'buddies';

    identityPlatform.removeValuesFromField(identityId, 'channels', channelName, function(error, output) {
      expect(error).to.equal(null);
      expect(output.n).to.equal(0);
      expect(output.nModified).to.equal(0);
      return done();
    });
  });

  it('findIdentitiesByFieldValue successfully', function(done) {

    var identityRef = ['01f0000000000000003f0001', '01f0000000000000003f0003'];

    identityPlatform.findIdentitiesByFieldValue('_id', identityRef, function(error, foundIdentities) {
      expect(error).to.equal(null);
      expect(foundIdentities.length).to.equal(foundIdentities.length);
      return done();
    });
  });

  it('subscribeIdentityToChannels successfully for existing channel', function(done) {

    var subscribedChannel = ['buddies'];
    var identityToSubscribe = '01f0000000000000003f0002';

    identityPlatform.subscribeIdentityToChannels(identityToSubscribe, subscribedChannel, function(error, subscribedIdentityId) {
      expect(error).to.equal(null);
      expect(subscribedIdentityId).to.equal(identityToSubscribe);
      return done();
    });
  });

  it('subscribeIdentityToChannels successfully for NON-existing channel', function(done) {

    var subscribedChannel = ['invalid'];
    var identityToSubscribe = '01f0000000000000003f0002';

    identityPlatform.subscribeIdentityToChannels(identityToSubscribe, subscribedChannel, function(error, subscribedIdentityId) {
      expect(error).to.equal(null);
      expect(subscribedIdentityId).to.equal(identityToSubscribe);
      return done();
    });
  });
});
