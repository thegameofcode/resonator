'use strict';
require('./../global_conf');

const expect = require('chai').expect;

const checkSingleEmail = require('./../../lib/middleware/check_single_email');

describe('Single target email middleware', function() {

  const emailNotificationUrl = '/api/notification/singleEmail';

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
      to: 'john@example.com',
      from: 'source@example.com',
      html: 'Hello world!',
      subject: 'Greetings'
    };

    done();
  });

  it('returns a BadRequestError for a missing \'message\' field', function(done) {

    delete emailObj.html;
    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'html\' String property in request body');
      done();
    };

    checkSingleEmail()(request, res, next);
  });

  it('returns a BadRequestError for a non-String \'html\' field', function(done) {

    emailObj.html = [emailObj.html];
    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('BadRequestError');
      expect(error.body.message).to.equal('Missing \'html\' String property in request body');
      done();
    };

    checkSingleEmail()(request, res, next);
  });

  it('passes validations for a missing \'subject\' field', function(done) {

    delete emailObj.subject;
    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkSingleEmail()(request, res, next);
  });

  it('passes validations for a missing \'from\' field', function(done) {

    delete emailObj.from;
    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkSingleEmail()(request, res, next);
  });

  it('passes validations for a well-formatted email object', function(done) {

    request.body = emailObj;

    let res = {};

    let next = function(error) {
      expect(error).to.equal(undefined);
      done();
    };

    checkSingleEmail()(request, res, next);
  });

});
