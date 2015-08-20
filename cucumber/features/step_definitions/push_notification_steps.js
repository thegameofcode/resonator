module.exports = function() {

    this.World = require('../support/world').World;

    this.Then(/^a request is sent to (.*) to send a push notification (.*) and returns (.*)$/, function(endpoint, pushNotification, response, callback) {
        var _this = this;

        var pushNotificationObj = _this.readJSONResource(pushNotification);
        var res = _this.readJSONResource(response);

        var request = this.buildRequest('POST', endpoint, {
            'x-user-id': this.get('identity')
        });

        request
          .send(pushNotificationObj)
          .expect(res.status)
          .end(callback);
    });
};