'use strict';
const sinon = require('sinon');
const expect = require('chai').expect;

const emailPlatform = require('./../../lib/platforms/email');
const TEST_FILES = './../sample_files/';
const mailgun = require('./../../lib/transport/mailgun');
const fileHandler = require('./../../lib/util/file_handler');
let mailgunStub, fileHandlerStub;

describe('Single email', function() {

  beforeEach(function(done) {
    mailgunStub = sinon.stub(mailgun, 'send');
    mailgunStub.yields(null, 'Queued', {output: 'Queued notifications' });
    fileHandlerStub = sinon.stub(fileHandler, 'readFile');
    return done();
  });

  afterEach(function(done) {
    mailgunStub.restore();
    fileHandlerStub.restore();
    return done();
  });

  it('sends a single HTML email to a destination', function(done) {

    const requestBody = require(TEST_FILES + 'Orchestrator').html_single_email;

    emailPlatform.sendSingleEmail(requestBody, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('sends a single MJML email to a destination', function(done) {

    const requestBody = require(TEST_FILES + 'Orchestrator').mjml_single_email;
    fileHandlerStub.returns({content: '<html><body><h1>Hello {{USER}}</h1></body></html>'});

    emailPlatform.sendSingleEmail(requestBody, function(error, output) {
      expect(error).to.equal(null);
      expect(output.response).to.equal('Queued');
      expect(output.body.output).to.equal('Queued notifications');
      return done();
    });
  });

  it('yields an error due to invalid MJML content', function(done) {

    const requestBody = require(TEST_FILES + 'Orchestrator').invalid_mjml_single_email;

    fileHandlerStub.returns({error: {message: 'HTML template not found', statusCode: 404, body: { code: 'NotFoundError', message: 'HTML template not found'}}});

    emailPlatform.sendSingleEmail(requestBody, function(error, output) {
      expect(error).to.not.equal(null);
      expect(output).to.equal(undefined);
      expect(error).to.have.property('message', 'HTML template not found');
      expect(error).to.have.property('statusCode', 404);
      expect(error).to.have.property('body');
      expect(error.body).to.have.property('code', 'NotFoundError');
      fileHandlerStub.restore();
      return done();
    });
  });
});
