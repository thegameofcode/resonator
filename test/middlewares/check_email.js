require('./../global_conf');

var expect = require('chai').expect;

var checkEmail = require('./../../lib/middleware/check_email');

describe('Batch email middleware', function() {

  var emailNotificationUrl = '/api/notification/email';

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
      channels: ['buddies'],
      identities: ['01f0000000000000003f0002'],
      content: {
        from: 'source@example.com',
        message: 'Hello world!',
        subject: 'Greetings'
      }
    };

    done();
  });

  it('returns a BadRequestError for a missing \'from\' field', function(done) {

    delete emailObj.content.from;
    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'from\' property in parameters');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('returns a BadRequestError for a missing \'message\' field', function(done) {

    delete emailObj.content.message;
    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'message\' String property in request body \'content\' object');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('returns a BadRequestError for a non-String \'message\' field', function(done) {

    emailObj.content.message = [emailObj.content.message];
    request.body = emailObj;

    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'message\' String property in request body \'content\' object');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('passes validations for a missing \'subject\' field', function(done) {

    delete emailObj.content.subject;
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
