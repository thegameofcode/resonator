require('./../global_conf');

var expect = require('chai').expect;

var channelPlatform = require('./../../lib/platforms/channel');
var loadFixtures = require('./../../scripts/load_fixtures');
var log = require('./../../lib/util/logger');

var TEST_FILES = './../sample_files/';

describe('Channel platform: ', function() {

  beforeEach(function(done) {
    log.debug('Loading fixtures');
    loadFixtures(done);
  });

  it('getChannel successfully', function(done) {

    var channelId = '01f0000000000000006f0001';

    channelPlatform.get(channelId, function(error, foundChannel) {
      expect(error).to.equal(null);
      expect(foundChannel).to.not.equal(undefined);
      return done();
    });
  });

  it('getChannelwith CastError', function(done) {

    var channelId = 'aaaa';

    channelPlatform.get(channelId, function(error, foundChannel) {
      expect(error.name).to.equal('CastError');
      expect(error.message).to.equal('Cast to ObjectId failed for value "' + channelId +'" at path "_id"');
      expect(foundChannel).to.equal(undefined);
      return done();
    });
  });

  it('getChannel for a non-existing Channel object', function(done) {

    var channelId = '01f0000000000000006f0020';

    channelPlatform.get(channelId, function(error, notFoundChannel) {
      expect(error).to.equal(null);
      expect(notFoundChannel).to.equal(null);
      return done();
    });
  });

  it('retrieveChannelDataForIdentity successfully', function(done) {

    var channelId = '01f0000000000000003f0001';

    channelPlatform.retrieveChannelDataForIdentity(channelId, function(error, channelData) {
      expect(error).to.equal(null);
      expect(channelData.length).to.equal(2);
      return done();
    });
  });

  it('createChannel successfully', function(done) {

    var newChannel = require(TEST_FILES + 'Channel.json').valid;

    channelPlatform.createChannel(newChannel, function(error, createdChannel) {
      expect(error).to.equal(null);
      expect(createdChannel.name).to.equal(newChannel.name);
      expect(createdChannel.identityRef.length).to.equal(newChannel.identityRef.length);
      return done();
    });
  });

  it('createChannel with errors', function(done) {

    var channelDuplicate = require(TEST_FILES + 'Channel.json').duplicated;

    channelPlatform.createChannel(channelDuplicate, function(error, createdChannel) {
      expect(error.statusCode).to.equal(409);
      expect(error.body.code).to.equal('ConflictError');
      expect(error.body.message).to.equal('There already exists a channel with the provided name');
      expect(createdChannel).to.equal(undefined);
      return done();
    });
  });

  it('deleteChannel successfully', function(done) {

    var channelToDeleteId = '01f0000000000000006f0001';

    channelPlatform.deleteChannel(channelToDeleteId, function(error) {
      expect(error).to.equal(undefined);
      return done();
    });
  });

  it('deleteChannel with errors', function(done) {

    var channelToDeleteId = '01f0000000000000006f0020';

    channelPlatform.deleteChannel(channelToDeleteId, function(error) {
      expect(error.statusCode).to.equal(404);
      expect(error.body.code).to.equal('NotFoundError');
      expect(error.body.message).to.equal('Requested channel not found in database');
      return done();
    });
  });

  it('updateChannel successfully', function(done) {

    var channelWithChanges = require(TEST_FILES + 'Channel.json').changed;
    var channelToUpdateId = '01f0000000000000006f0001';
    channelPlatform.updateChannel(channelToUpdateId, channelWithChanges, function(error) {
      expect(error).to.equal(undefined);

      channelPlatform.get(channelToUpdateId, function(error, foundChannel) {
        expect(error).to.equal(null);
        expect(foundChannel.name).to.equal(channelWithChanges.name);
        expect(foundChannel.identityRef.length).to.equal(channelWithChanges.identityRef.length);
        return done();
      });
    });
  });

  it('updateChannel with errors', function(done) {

    var duplicateChannel = require(TEST_FILES + 'Channel.json').duplicated;
    var channelToUpdateId = '01f0000000000000006f0001';

    channelPlatform.updateChannel(channelToUpdateId, duplicateChannel, function(error) {
      expect(error.name).to.equal('MongoError');
      return done();
    });
  });

  it('retrieveIdentityListForChannel successfully', function(done) {

    var channelId = '01f0000000000000006f0001';

    channelPlatform.retrieveIdentityListForChannel(channelId, function(error, identityList) {
      expect(error).to.equal(null);
      expect(identityList.length).to.equal(2);
      return done();
    });
  });

  it('retrieveIdentityListForChannel with errors', function(done) {
    var channelId = '01f0000000000000006f0020';

    channelPlatform.retrieveIdentityListForChannel(channelId, function(error, identityList) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Requested Channel object not found in database');
      expect(identityList).to.equal(undefined);
      return done();
    });
  });

  it('deleteIdentityFromChannel successfully', function(done) {

    var channelToDeleteIdentityFrom = '01f0000000000000006f0001';
    var identityToDeleteFromChannel = '01f0000000000000003f0001';

    channelPlatform.deleteIdentityFromChannel(channelToDeleteIdentityFrom, identityToDeleteFromChannel, function(error) {
      expect(error).to.equal(null);
      return done();
    });
  });

  it ('deleteIdentityFromChannel with errors', function(done) {

    var channelToDeleteIdentityFrom = '01f0000000000000006f0020';
    var identityToDeleteFromChannel = '01f0000000000000003f0001';

    channelPlatform.deleteIdentityFromChannel(channelToDeleteIdentityFrom, identityToDeleteFromChannel, function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Requested Channel object not found in database');
      return done();
    });
  });

  it ('deleteIdentityFromChannel with other errors', function(done) {

    var channelToDeleteIdentityFrom = '01f0000000000000006f0001';
    var identityToDeleteFromChannel = '01f0000000000000003f0020';

    channelPlatform.deleteIdentityFromChannel(channelToDeleteIdentityFrom, identityToDeleteFromChannel, function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Requested Identity object not found in database');
      return done();
    });
  });

  it('removeValuesFromField successfully', function(done) {

    var channelId = '01f0000000000000006f0001';
    var identityId = '01f0000000000000003f0001';

    channelPlatform.removeValuesFromField(channelId, 'identityRef', identityId, function(error) {
      expect(error).to.equal(null);

      channelPlatform.get(channelId, function(error, foundChannel) {
        expect(error).to.equal(null);
        expect(foundChannel.identityRef.length).to.equal(1);
        return done();
      });
    });
  });

  it('removeValuesFromField for non-existing Channel object', function(done) {

    var channelId = '01f0000000000000006f0020';
    var identityId = '01f0000000000000003f0001';

    channelPlatform.removeValuesFromField(channelId, 'identityRef', identityId, function(error) {
      expect(error).to.equal(null);
      return done();
    });
  });

  it('removeValuesFromField for non-existing Identity object', function(done) {

    var channelId = '01f0000000000000006f0001';
    var identityId = '01f0000000000000003f0020';

    channelPlatform.removeValuesFromField(channelId, 'identityRef', identityId, function(error) {
      expect(error).to.equal(null);
      return done();
    });
  });

  it('removeValuesFromField for non-existing Channel object', function(done) {
    var channelId = '01f0000000000000006f0020';
    var identityId = '01f0000000000000003f0001';

    channelPlatform.removeValuesFromField(channelId, 'identityRef', identityId, function(error) {
      expect(error).to.equal(null);
      return done();
    });
  });

  it('removeValuesFromField for non-existing Identity object', function(done) {
    var channelId = '01f0000000000000006f0001';
    var identityId = '01f0000000000000003f0020';

    channelPlatform.removeValuesFromField(channelId, 'identityRef', identityId, function(error) {
      expect(error).to.equal(null);
      return done();
    });
  });
});