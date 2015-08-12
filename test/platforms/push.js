require('./../global_conf');

var assert = require('assert');
var sinon = require('sinon');

var pushPlatform = require('./../../lib/platforms/push');
var apnUtil = require('./../../lib/util/apn');
var identityPlatform = require('./../../lib/platforms/identity');
var loadFixtures = require('./../../scripts/load_fixtures');
var log = require('./../../lib/util/logger');

describe('Apn Feedback Service', function() {
  var apnStub;

    beforeEach(function(done) {
        log.debug('Loading fixtures');
        loadFixtures(done);
    });

  it('sends an APN push notification', function(done){

    var apnRequest = require(process.cwd() + '/cucumber/test_files/apn/valid_apn');
    var apnResponse = require(process.cwd() + '/cucumber/test_files/apn/valid_apn_response');

    apnStub = sinon.stub(apnUtil, 'pushNotification');

    apnStub.yields(null, {});

    pushPlatform.sendPush(apnRequest, function(err, result) {

      sinon.assert.calledOnce(apnUtil.pushNotification);
      assert.deepEqual(result, apnResponse.data, 'Push notification responses do not match');
      apnStub.restore();

      return done();
    });
  });




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
