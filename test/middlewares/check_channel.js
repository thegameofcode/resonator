var _ = require('lodash');

require('./../global_conf');

var expect = require('chai').expect;

var checkChannel = require('./../../lib/middleware/check_channel');

describe('Channel middleware', function() {

  var channelEndpoints = [
    {url: '/api/channel', method: 'POST'},
    {url: '/api/channel/01f0000000000000006f0002', method: 'PUT'}
  ];

  var channelObj = {};

  var request = {
    url: '',
    method: '',
    json: true,
    headers: {}
  };

  beforeEach(function(done) {
    request.headers['x-user-id'] = '01f0000000000000003f0002';
    channelObj = {
     name: "sample"
    };
    done();
  });

  it('returns a BadRequestError for a missing channel object', function(done) {

    channelObj = {};

    request.body = channelObj;

    _.forEach(channelEndpoints, function(endpoint) {

      var res = {};

      request.url = endpoint.url;
      request.method = endpoint.method;

      var next = function(error) {
        expect(error.statusCode).to.equal(400);
        expect(error.body.code).to.equal('BadRequestError');
        expect(error.body.message).to.equal('Missing channel object');
      };

      checkChannel()(request, res, next);
    });

    done();
  });

  it('returns a ConflictError for a missing \'name\' property in the Channel object', function(done) {

    delete channelObj.name;
    channelObj.not_required_field = "meaningless";

    request.body = channelObj;

    _.forEach(channelEndpoints, function(endpoint) {

      var res = {};

      request.url = endpoint.url;
      request.method = endpoint.method;

      var next = function(error) {
        expect(error.statusCode).to.equal(409);
        expect(error.body.code).to.equal('ConflictError');
        expect(error.body.message).to.equal('Missing \'name\' property in channel object');
      };

      checkChannel()(request, res, next);
    });

    done();
  });

  it('passes all validations for a well-formatted channel object', function(done) {

    request.body = channelObj;


    _.forEach(channelEndpoints, function(endpoint) {

      var res = {};

      request.url = endpoint.url;
      request.method = endpoint.method;

      var next = function(error) {
        expect(error).to.equal(undefined);
      };

      checkChannel()(request, res, next);
    });

    done();
  });
});
