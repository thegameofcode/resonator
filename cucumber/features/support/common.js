var assert = require('assert');

module.exports = function() {

  this.World = require('../support/world.js').World;

  this.Given(/^an authenticated identity in the app with (.*)$/, function(identityId, callback) {
    this.register('identity', identityId);

    return callback();
  });

  this.Given(/^someone makes a POST to (.*) with content (.*)$/, function(endpoint, identityContents, callback) {

    var body = this.readJSONResource(identityContents);

    this.register('url', endpoint);

    var identity = this.get('identity') || {};
    var request = this.buildRequest('POST', endpoint, {
      'x-user-id': identity
    }, body);

    this.register('request', request);
    this.register('body', body);

    return callback();
  });

  this.Then(/^the backend responds with (\d+)$/, function(status, callback) {
    var request = this.get('request');
    var body = this.get('body');
    var _this = this;
    request
      .expect(Number(status));

    if (body) {
      request.send(body);
    }

    request.end(function(err, response) {

      if (err) {
        return callback(err);
      }

      _this.register('response', response);
      return callback();
    });

  });

  this.Then(/^the mock response is (.*)$/, function(response, callback) {
    var request = this.get('request');
    var body = this.get('body');
    var _this = this;

    var res = _this.readJSONResource(response);

    request
      .expect(Number(res.status));

    if (body) {
      request.send(body);
    }

    request.end(function(err, response) {

      if (err) {
        return callback(err);
      }

      _this.register('response', response);
      return callback();
    });

  });

  this.Then(/^the response includes a Mongoose ObjectId identifier$/, function(callback) {

    var response = this.get('response');

    assert.ok(response.body.id !== undefined, 'Response does not contain a Mongoose ObjectId identifier');
    return callback();
  });
};
