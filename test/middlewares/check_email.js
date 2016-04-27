'use strict';
require('./../global_conf');

const expect = require('chai').expect;
const checkEmail = require('./../../lib/middleware/check_email');

describe('Batch email middleware', function() {

  const emailNotificationUrl = '/api/notification/email';

  let emailObj = {};

  let request = {
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

    let res = {};

    let next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'from\' property in parameters');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('returns a BadRequestError for a missing \'message\' and \'template\' field', function(done) {

    delete emailObj.content.message;
    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'message\' String or \'template\' object property in \'content\'');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('returns a BadRequestError for a non-String \'message\' field', function(done) {

    emailObj.content.message = [emailObj.content.message];
    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'message\' String or \'template\' object property in \'content\'');
      done();
    };

    checkEmail()(request, res, next);
  });

  it('passes validations for a missing \'subject\' field', function(done) {

    delete emailObj.content.subject;
    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkEmail()(request, res, next);
  });

  it('passes validations for a well-formatted email object', function(done) {

    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkEmail()(request, res, next);
  });

  it('passes validations for a well-formatted email object with template object', function(done) {

    delete emailObj.content.message;
    emailObj.content.template = {
      filename: 'template',
      placeholders: {
        USER: 'Mr. Invent'
      }
    };

    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkEmail()(request, res, next);
  });

});
