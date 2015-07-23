require('./../global_conf');

var expect = require('chai').expect;

var checkEmail = require('./../../lib/middleware/check_email');

describe('Email middleware', function() {

  var emailNotificationUrl = '/api/push/email';

  var emailObj = {};

  var request = {
    url: emailNotificationUrl,
    method: 'POST',
    json: true,
    headers: {}
  };

  beforeEach(function(done) {
    request.headers['x-user-id'] = '01f0000000000000003f0002';
    emailObj = {
      to: 'target@example.com',
      from: 'source@example.com',
      message: 'Hello world!',
      subject: 'Greetings'
    };
    done();
  });

  it('returns a ConflictError for a missing \'to\' field', function(done) {

    delete emailObj.to;

    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(409);
      expect(error.body.code).to.equal('ConflictError');
      expect(error.body.message).to.equal('Missing \'to\' property in email object');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('returns a ConflictError for a missing \'from\' field', function(done) {

    delete emailObj.from;

    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(409);
      expect(error.body.code).to.equal('ConflictError');
      expect(error.body.message).to.equal('Missing \'from\' property in email object');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('returns a ConflictError for a missing \'message\' field', function(done) {

    delete emailObj.message;

    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(409);
      expect(error.body.code).to.equal('ConflictError');
      expect(error.body.message).to.equal('Missing \'message\' property in email object');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('passes validations for a missing \'subject\' field', function(done) {

    delete emailObj.subject;

    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkEmail()(request, res, next);
  });

  it('passes validations for a well-formatted email object', function(done) {

    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkEmail()(request, res, next);
  });

});
