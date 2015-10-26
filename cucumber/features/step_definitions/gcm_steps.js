'use strict';

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a request is sent to (.*) to send an gcm push notification (.*) and returns (.*)$/, function(endpoint, gcm, response, callback) {
    const _this = this;

    const gcmObj = _this.readJSONResource(gcm);
    let res = _this.readJSONResource(response);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(gcmObj)
      .expect(res.status)
      .end(callback);
  });
};
