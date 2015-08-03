var assert = require('assert');
var nock = require('nock');

nock.disableNetConnect();

module.exports = function() {

    this.World = require('../support/world').World;

    this.Then(/^a request is sent to (.*) to send an gcm push notification (.*) and returns (.*)$/, function(endpoint, gcm, response, callback) {
        var _this = this;

        var gcmObj = _this.readJSONResource(gcm);
        var res = _this.readJSONResource(response);
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

        nock(GCM_MESSAGES_BASE_URL)
            .post(GCM_MESSAGES_ENDPOINT_URL)
            .times(5)
            .reply(200, googleGcmResponseMocked);


        var request = this.buildRequest('POST', endpoint, {
            'x-user-id': this.get('identity')
        });

        request
            .send(gcmObj)
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