var expect = require('chai').expect;
var config = require('config');
var mongoose = require('mongoose');
var async = require('async');

var checkIdentity = require('./../../lib/middleware/validate_identity');

describe('Identity middleware', function() {

  var hearbeatUrl = '/heartbeat';

  var request = {
    url: hearbeatUrl,
    method: 'GET',
    headers: {}
  };


  before(function(done) {
    mongoose.connect(config.get('db.conn'), function(error) {
      if (error) console.error('Error while connecting:\n%\n', error);
      done(error);
    });
  });


  beforeEach(function(done) {
    request.headers = {};
    done();
  });

  it('returns an UnauthorizedError for no x-user-id header', function(done) {

    request.headers = {};
    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(401);
      expect(error.body.code).to.equal('UnauthorizedError');
      expect(error.body.message).to.equal('Missing authorization header');
      done();
    };

    checkIdentity()(request, res, next);
  });

  it('returns an InvalidHeader error for a badly formatted x-user-id header', function(done) {

    request.headers['x-user-id'] = 'asdf1111ccccblah';
    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(400);
      expect(error.body.code).to.equal('InvalidHeader');
      expect(error.body.message).to.equal('Invalid Authorization header format');
      done();
    };

    checkIdentity()(request, res, next);
  });

  it('returns an UnauthorizedError error for a non-existing Identity object', function(done) {

    request.headers['x-user-id'] = '01f0000123400000003f0043';
    var res = {};

    var next = function(error) {
      expect(error.statusCode).to.equal(401);
      expect(error.body.code).to.equal('UnauthorizedError');
      expect(error.body.message).to.equal('Identity not found');
      done();
    };

    checkIdentity()(request, res, next);
  });

  it('passes validations for a well-formatted x-user-id header', function(done) {

    request.headers['x-user-id'] = '01f0000000000000003f0001';
    var res = {};

    var next = function(error) {
      var requestIdentityId = request.identity._id;
      var identityIdStr = request.headers['x-user-id'];
      expect(requestIdentityId.equals(identityIdStr)).to.equal(true);
      expect(error).to.equal(undefined);
      done();
    };

    checkIdentity()(request, res, next);
  });

});
