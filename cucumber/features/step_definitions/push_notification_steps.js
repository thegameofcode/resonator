'use strict';

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a request is sent to (.*) to send a push notification (.*) and returns (.*)$/, function(endpoint, pushNotification, response, callback) {
    const _this = this;

    const pushNotificationObj = _this.readJSONResource(pushNotification);
    const res = _this.readJSONResource(response);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(pushNotificationObj)
      .expect(res.status)
      .end(callback);
  });
};
