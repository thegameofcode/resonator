require('./../global_conf');

var assert = require('assert');
var expect = require('chai').expect;

var pushPlatform = require('./../../lib/platforms/push');
var identityPlatform = require('./../../lib/platforms/identity');
var buildQueryOptions = require('./../../lib/platforms/orchestrator').buildQueryOptions;
var loadFixtures = require('./../../scripts/load_fixtures');
var log = require('./../../lib/util/logger');

var TEST_FILES = './../sample_files/';

describe('Push platform: ', function() {

    beforeEach(function(done) {
        log.debug('Loading fixtures');
        loadFixtures(done);
    });

  it('sendApnPush', function(done) {

    var requestBody = require(TEST_FILES + 'Push.json').apn_only;

    var queryOptions = buildQueryOptions({
      identities: requestBody.identities,
      channels: [],
      resource: pushPlatform.options.apn.resourceName
    });

    identityPlatform.find(queryOptions,
      pushPlatform.options.apn.projectionOptions, {skip: 0, sort: 'ts'}, function(error, foundIdentities) {

        expect(error).to.equal(null);
        expect(foundIdentities.length).equal(requestBody.identities.length);

        pushPlatform.sendApn(foundIdentities, requestBody, function(error) {
          expect(error).to.equal(null);
          return done();
        });
      });
  });

  it('sendGcmPush', function(done) {
    var requestBody = require(TEST_FILES + 'Push.json').gcm_only;

    var queryOptions = buildQueryOptions({
      identities: requestBody.identities,
      channels: [],
      resource: pushPlatform.options.gcm.resourceName
    });

    identityPlatform.find(queryOptions,
      pushPlatform.options.gcm.projectionOptions, {skip: 0, sort: 'ts'}, function(error, foundIdentities) {

        expect(error).to.equal(null);
        expect(foundIdentities.length).equal(requestBody.identities.length);

        pushPlatform.sendGcm(foundIdentities, requestBody, function(error) {
          expect(error).to.equal(401);
          return done();
        });
      });  });

  it('Delete device returned from FeedBack Service', function(done) {

    var devices = ["<0123 4567 89AB CDEF>"];
    var identityId = '01f0000000000000003f0002';


    pushPlatform.deleteApnDevices(devices, function(err){
      assert.equal(err, null);

      identityPlatform.get(identityId, function(err, result){
        assert.equal(err, null);

        assert.strictEqual(result.devices.apn.indexOf(devices[0]), -1);
        done();
      });
    });
  });
});
