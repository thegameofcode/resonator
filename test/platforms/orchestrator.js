'use strict';
require('./../global_conf');

const expect = require('chai').expect;
const sinon = require('sinon');

const orchestrator = require('./../../lib/platforms/orchestrator');
const emailPlatform = require('./../../lib/platforms/email');
const smsPlatform = require('./../../lib/platforms/sms');
const pushPlatform = require('./../../lib/platforms/push');

const mailgun = require('./../../lib/transport/mailgun');
const twilio = require('./../../lib/transport/twilio');
const apn = require('./../../lib/transport/apn');
const gcm = require('./../../lib/transport/gcm');

const loadFixtures = require('./../../scripts/load_fixtures');
const log = require('./../../lib/util/logger');

const TEST_FILES = './../sample_files/';

let mailgunStub, apnStub, gcmStub, smsStub;

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

  it('sendNotification -> batch email', function(done) {

    const requestBody = require(TEST_FILES + 'Orchestrator').email;

    orchestrator.sendNotification(requestBody, emailPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendNotification -> sms', function(done) {

    const requestBody = require(TEST_FILES + 'Orchestrator').sms;

    orchestrator.sendNotification(requestBody, smsPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendPushNotification -> APN', function(done) {

    const requestBody = require(TEST_FILES + 'Push.json').apn_only;

    orchestrator.sendPushNotifications(requestBody, pushPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendPushNotification -> GCM', function(done) {

    const requestBody = require(TEST_FILES + 'Push.json').gcm_only;

    orchestrator.sendPushNotifications(requestBody, pushPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sendPushNotification -> APN & GCM', function(done) {

    const requestBody = require(TEST_FILES + 'Push.json').gcm_and_apn;

    orchestrator.sendPushNotifications(requestBody, pushPlatform, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

});
