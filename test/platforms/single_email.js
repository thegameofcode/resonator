'use strict';
const sinon = require('sinon');
const expect = require('chai').expect;

const emailPlatform = require('./../../lib/platforms/email');
const TEST_FILES = './../sample_files/';
const mailgun = require('./../../lib/transport/mailgun');
let mailgunStub;

describe('Single email', function() {

  beforeEach(function(done) {
    mailgunStub = sinon.stub(mailgun, 'send');
    mailgunStub.yields(null, 'Queued', {output: 'Queued notifications' });
    return done();
  });

  afterEach(function(done) {
    mailgunStub.restore();
    return done();
  });

  it('sends a single email to a destination', function(done) {

    const requestBody = require(TEST_FILES + 'Orchestrator').single_email;

    emailPlatform.sendSingleEmail(requestBody, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });
});
