require('./../global_conf');

var expect = require('chai').expect;
var sinon = require('sinon');

var orchestrator = require('./../../lib/platforms/orchestrator');
var emailPlatform = require('./../../lib/platforms/email');
var smsPlatform = require('./../../lib/platforms/sms');
var pushPlatform = require('./../../lib/platforms/push');

var mailgun = require('./../../lib/transport/mailgun');
var twilio = require('./../../lib/transport/twilio');
var apn = require('./../../lib/transport/apn');
var gcm = require('./../../lib/transport/gcm');

var loadFixtures = require('./../../scripts/load_fixtures');
var log = require('./../../lib/util/logger');

var TEST_FILES = './../sample_files/';

var mailgunStub, apnStub, gcmStub, smsStub;

describe('Orchestrator platform: ', function() {

  beforeEach(function(done) {
    log.debug('Loading fixtures');

    mailgunStub = sinon.stub(mailgun, 'send');
    mailgunStub.yields(null, {});

    apnStub = sinon.stub(apn, 'pushNotification');
    apnStub.yields(null, {});

    gcmStub = sinon.stub(gcm, 'sendGCM');
    gcmStub.yields(null, {});

    smsStub = sinon.stub(twilio, 'sendSms');
    smsStub.yields(null, {});
    loadFixtures(done);
  });

  afterEach(function(done) {
    mailgunStub.restore();
    apnStub.restore();
    gcmStub.restore();
    smsStub.restore();
    return done();
  });

  it('sendNotification -> email', function(done) {

    var requestBody = require(TEST_FILES + 'Orchestrator').email;

    orchestrator.sendNotification(requestBody, emailPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendNotification -> sms', function(done) {

    var requestBody = require(TEST_FILES + 'Orchestrator').sms;

    orchestrator.sendNotification(requestBody, smsPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendPushNotification -> APN', function(done) {

    var requestBody = require(TEST_FILES + 'Push.json').apn_only;

    orchestrator.sendPushNotifications(requestBody, pushPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendPushNotification -> GCM', function(done) {

    var requestBody = require(TEST_FILES + 'Push.json').gcm_only;

    orchestrator.sendPushNotifications(requestBody, pushPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendPushNotification -> APN & GCM', function(done) {

    var requestBody = require(TEST_FILES + 'Push.json').gcm_and_apn;

    orchestrator.sendPushNotifications(requestBody, pushPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

});