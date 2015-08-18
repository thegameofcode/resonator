var assert = require('assert');
var config = require('config');
var nock = require('nock');

nock.disableNetConnect();

module.exports = function() {

    this.World = require('../support/world').World;

    this.Then(/^a request is sent to (.*) to send an email (.*) and returns (.*)$/, function(endpoint, email, response, callback) {
        var _this = this;

        var emailObj = _this.readJSONResource(email);
        var res = _this.readJSONResource(response);

        var MAILGUN_MESSAGES_BASE_URL = 'https://api.mailgun.net';
        var MAILGUN_MESSAGES_ENDPOINT_URL = '/v3/' + config.get('transport.mailgun.domain') + '/messages';

        nock(MAILGUN_MESSAGES_BASE_URL)
          .persist() // Required since multiple requests can be made in parallel from the platform
          .post(MAILGUN_MESSAGES_ENDPOINT_URL)
          .reply(200, res.data);

        var request = this.buildRequest('POST', endpoint, {
            'x-user-id': this.get('identity')
        });

        request
            .send(emailObj)
            .expect(res.status)
            .end(function(err, response) {

            if (err) {
                return callback(err);
            }
            assert.deepEqual(response.body, res.data, 'Responses do not match');

            return callback();
        });
    });
};
