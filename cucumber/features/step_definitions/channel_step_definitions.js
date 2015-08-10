var assert = require('assert');
var _ = require('lodash');

module.exports = function() {

  this.World = require('../support/world').World;

  this.When(/^a user makes a PUT to (.*) to change channel (.*) with content (.*)$/, function(endpoint, channelId, value, callback) {

    var body = this.readJSONResource(value);
    this.register('body', body);

    var url = endpoint.replace(':channelId', channelId);
    this.register('url', url);

    var request = this.buildRequest('PUT', url, {
      'x-user-id': this.get('identity')
    }, body);
    this.register('request', request);

    return callback();
  });

  this.Then(/^the next GET request to (.*) returns the channel (.*) with (.*) field with value (.*)$/, function(endpoint, channelId, field, fieldContents, callback) {

    var request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    fieldContents = this.readJSONResource(fieldContents);

    request
      .expect(200)
      .end(function(err, response) {
        if (err) {
          return callback(err);
        }

        var nameToCheck = _.result(_.find(response.body, function(channel) {
          return channel.id === channelId;
        }), 'name');

        assert.ok(nameToCheck, 'Channel object with id ' + channelId + ' not found in GET response');
        assert.equal(nameToCheck, fieldContents.name, 'Channels\' field \'name\' do not match');

        return callback();
      });
  });

  this.When(/^a user performs a GET to (.*) for channel (.*)$/, function(endpoint, channelId, callback) {

    var url = endpoint.replace(':channelId', channelId);
    this.register('url', url);

    var request = this.buildRequest('GET', url, {
      'x-user-id': this.get('identity')
    });
    this.register('request', request);

    return callback();
  });

  this.When(/^a user makes a DELETE to (.*) for channel (.*)$/, function(endpoint, channelId, callback) {

    var url = endpoint.replace(':channelId', channelId);
    this.register('url', url);

    var request = this.buildRequest('DELETE', url, {
      'x-user-id': this.get('identity')
    });
    this.register('request', request);

    return callback();
  });

  this.When(/^a user performs a DELETE to (.*) to delete identity (.*) from channel (.*)$/, function(endpoint, identityId, channelId, callback) {

    var url = endpoint.replace(':channelId', channelId).replace(':identityId', identityId);
    this.register('url', url);

    var request = this.buildRequest('DELETE', url, {
      'x-user-id': this.get('identity')
    });
    this.register('request', request);

    return callback();
  });
};