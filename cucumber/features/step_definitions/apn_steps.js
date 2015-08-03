var assert = require('assert');
var nock = require('nock');

nock.disableNetConnect();

module.exports = function() {

    this.World = require('../support/world').World;

    this.Then(/^a request is sent to (.*) to send an apn push notification (.*) and returns (.*)$/, function(endpoint, apn, response, callback) {
        var _this = this;

        var apnObj = _this.readJSONResource(apn);
        var res = _this.readJSONResource(response);

        var APN_MESSAGES_BASE_URL = '';
        var APN_MESSAGES_ENDPOINT_URL = '';

        nock(APN_MESSAGES_BASE_URL)
            .post(APN_MESSAGES_ENDPOINT_URL)
            .times(1)
            .reply(200, res.data);

        var request = this.buildRequest('POST', endpoint, {
            'x-user-id': this.get('identity')
        });

        request
            .send(apnObj)
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