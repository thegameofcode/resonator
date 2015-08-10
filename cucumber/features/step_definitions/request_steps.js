var assert = require('assert');
var _ = require('lodash');

module.exports = function() {

  this.World = require('../support/world').World;

  this.When(/^a user makes a GET to (.*)$/, function(endpoint, callback) {
    this.register('url', endpoint);

    var request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    this.register('request', request);
    return callback();

  });

  this.Then(/^the response includes an Array with (.*) items$/, function(numItems, callback) {

    numItems = Number(numItems);

    var response = this.get('response');

    assert.ok(_.isArray(response.body), 'Response object is not of type Array');

    var itemsCount = response.body.length;
    assert.equal(itemsCount, numItems, 'Number of items does not match');

    return callback();
  });
};