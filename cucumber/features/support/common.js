'use strict';
const assert = require('assert');

module.exports = function() {

  this.World = require('../support/world.js').World;

  this.Given(/^an authenticated identity in the app with (.*)$/, function(identityId, callback) {
    this.register('identity', identityId);

    return callback();
  });

  this.Given(/^someone makes a POST to (.*) with content (.*)$/, function(endpoint, identityContents, callback) {

    const body = this.readJSONResource(identityContents);

    this.register('url', endpoint);

    const identity = this.get('identity') || {};
    const request = this.buildRequest('POST', endpoint, {
      'x-user-id': identity
    }, body);

    this.register('request', request);
    this.register('body', body);

    return callback();
  });

  this.Then(/^the backend responds with (\d+)$/, function(status, callback) {
    let request = this.get('request');
    const body = this.get('body');
    const _this = this;
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

  this.Then(/^the response includes a Mongoose ObjectId identifier$/, function(callback) {

    const response = this.get('response');

    assert.ok(response.body.id !== undefined, 'Response does not contain a Mongoose ObjectId identifier');
    return callback();
  });
};
