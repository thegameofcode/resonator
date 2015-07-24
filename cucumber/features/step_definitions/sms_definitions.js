var assert = require('assert');
var _ = require('lodash');
var nock = require('nock');

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a mock request is sent to (.*) to send an SMS message (.*) and returns (.*)$/, function(endpoint, sms, response, callback) {

    var request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    var _this = this;

    var body = _this.readJSONResource(sms);
    var res = _this.readJSONResource(response);

    var url = _.clone(request.url).replace(endpoint, '');

    nock(url)
      .post(endpoint, body)
      .reply(res.status, res.data);

    request
      .expect(Number(res.status));

    if (body) {
      request.send(body);
    }

    request.end(function(err, response) {

      if (err) {
        return callback(err);
      }

      assert.deepEqual(response.body, res.data, 'Responses do not match');

      return callback();
    });
  });
};