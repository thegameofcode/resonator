var _ = require('lodash');
var assert = require('assert');

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
};