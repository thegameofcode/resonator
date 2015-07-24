var assert = require('assert');
var config = require('config');
var nock = require('nock');
var request = require('request');

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a mock request is sent to (.*) to send an SMS message (.*) and returns (.*)$/, function(endpoint, sms, response, callback) {

    var _this = this;

    var smsObj = _this.readJSONResource(sms);
    var res = _this.readJSONResource(response);

    var url = config.get('host') + ':' + config.get('port');

    var nock_req = nock(url)
      .post(endpoint, smsObj)
      .reply(res.status, res.data);

    var requestOptions = {
      body: smsObj,
      json: true,
      method: 'POST',
      url: url + endpoint
    };

    request(requestOptions, function(err, response) {

      if (err) {
        return callback(err);
      }

      assert.deepEqual(response.body, res.data, 'Responses do not match');
      nock_req.done();

      return callback();
    });

  });
};