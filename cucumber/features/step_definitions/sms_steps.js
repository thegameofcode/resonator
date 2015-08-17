var assert = require('assert');
var config = require('config');
var nock = require('nock');

nock.enableNetConnect();

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a mock request is sent to (.*) to send an SMS message (.*) and returns (.*)$/, function(endpoint, sms, response, callback) {

    var _this = this;

    var smsObj = _this.readJSONResource(sms);
    var res = _this.readJSONResource(response);

    var url = config.get('twilio.base_url');
    var url_point = '2010-04-01/Accounts/{TestAccountSid}/SMS/Messages'.replace('{TestAccountSid}', 'Some_random_account_sid');

   nock(url)
      .filteringPath(function() {
        return url_point;
      })
      .post(url_point)
      .reply(res.status, res.data);


    var request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(smsObj)
      .expect(res.status)
      .end(function(err, response) {

        console.log('SMS', err, response.body);
        if (err) {
          return callback(err);
        }

        assert.deepEqual(response.body, res.data, 'Responses do not match');

        return callback();
      });
  });
};