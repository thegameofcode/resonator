var sinon = require('sinon');
var expect = require('chai').expect;

var emailPlatform = require('./../../lib/platforms/email');
var TEST_FILES = './../sample_files/';
var mailgun = require('./../../lib/transport/mailgun');
var mailgunStub;

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

    var requestBody = require(TEST_FILES + 'Orchestrator').single_email;

    emailPlatform.sendSingleEmail(requestBody, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });
});
