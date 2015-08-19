var assert = require('assert');
var nock = require('nock');

nock.disableNetConnect();

module.exports = function() {

    this.World = require('../support/world').World;

    this.Then(/^a request is sent to (.*) to send an gcm push notification (.*) and returns (.*)$/, function(endpoint, gcm, response, callback) {
        var _this = this;

        var gcmObj = _this.readJSONResource(gcm);
        var res = _this.readJSONResource(response);

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