'use strict';
const config = require('config');
const nock = require('nock');

nock.disableNetConnect();

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a request is sent to (.*) to send an email (.*) and returns (.*)$/, function(endpoint, email, response, callback) {
    let _this = this;

    let emailObj = _this.readJSONResource(email);
    let res = _this.readJSONResource(response);

    const MAILGUN_MESSAGES_BASE_URL = 'https://api.mailgun.net';
    const MAILGUN_MESSAGES_ENDPOINT_URL = '/v3/' + config.get('transport.mailgun.domain') + '/messages';

    nock(MAILGUN_MESSAGES_BASE_URL)
      .persist() // Required since multiple requests can be made in parallel from the platform
      .post(MAILGUN_MESSAGES_ENDPOINT_URL)
      .reply(200, res.data);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(emailObj)
      .expect(res.status)
      .end(callback);
  });
};
