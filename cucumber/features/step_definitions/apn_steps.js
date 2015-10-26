'use strict';
module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a request is sent to (.*) to send an apn push notification (.*) and returns (.*)$/, function(endpoint, apn, response, callback) {
    const _this = this;

    const apnObj = _this.readJSONResource(apn);
    let res = _this.readJSONResource(response);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(apnObj)
      .expect(res.status)
      .end(callback);
  });
};
