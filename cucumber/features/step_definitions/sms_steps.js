'use strict';
const config = require('config');
const nock = require('nock');

nock.enableNetConnect();

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a mock request is sent to (.*) to send an SMS message (.*) and returns (.*)$/, function(endpoint, sms, response, callback) {

    const _this = this;

    const smsObj = _this.readJSONResource(sms);
    const res = _this.readJSONResource(response);

    const url = config.get('transport.twilio.base_url');
    const urlPoint = '2010-04-01/Accounts/{TestAccountSid}/SMS/Messages'.replace('{TestAccountSid}', 'Some_random_account_sid');

    nock(url)
      .filteringPath(function() {
        return urlPoint;
      })
      .post(urlPoint)
      .reply(res.status, res.data);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(smsObj)
      .expect(res.status)
      .end(callback);
  });
};
