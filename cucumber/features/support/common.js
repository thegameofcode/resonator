
module.exports = function() {

  this.World = require('../support/world.js').World;

  this.Given(/^an authenticated identity in the app with (.*)$/, function(identityId, callback) {
    this.register('identity', identityId);

    return callback();
  });

  this.Then(/^the backend responds with (\d+)$/, function(status, callback) {
    var request = this.get('request');
    var body = this.get('body');
    var _this = this;

    request
      .expect(Number(status));

    if (body) {
      request.send(body);
    }

    request.end(function(err, response) {
      if (err) {
        return callback(err);
      }

      _this.register('response', response);
      return callback();
    });

  });
};
