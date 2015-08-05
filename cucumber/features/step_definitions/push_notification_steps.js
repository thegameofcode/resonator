var assert = require('assert');
var nock = require('nock');

nock.disableNetConnect();

module.exports = function() {

    this.World = require('../support/world').World;

    this.Then(/^a request is sent to (.*) to send a push notification (.*) and returns (.*)$/, function(endpoint, pushNotification, response, callback) {
        var _this = this;

        var pushNotificationObj = _this.readJSONResource(pushNotification);
        var res = _this.readJSONResource(response);

        var appleApnResponseMocked = JSON.stringify({});
        var googleGcmResponseMocked = JSON.stringify({
            "multicast_id": 108,
            "success": 2,
            "failure": 0,
            "canonical_ids": 0,
            "results": [
                { "message_id": "1:08" },
                { "message_id": "1:09" }
            ]
        });

        var GCM_MESSAGES_BASE_URL = 'https://android.googleapis.com';
        var GCM_MESSAGES_ENDPOINT_URL = '/gcm/send';
        var APN_MESSAGES_BASE_URL = 'https://gateway.sandbox.push.apple.com:2195';

        nock(APN_MESSAGES_BASE_URL)
            .post()
            .times(1)
            .reply(200, appleApnResponseMocked);

        nock(GCM_MESSAGES_BASE_URL)
            .post(GCM_MESSAGES_ENDPOINT_URL)
            .times(5)
            .reply(200, googleGcmResponseMocked);


        var request = this.buildRequest('POST', endpoint, {
            'x-user-id': this.get('identity')
        });

        request
            .send(pushNotificationObj)
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