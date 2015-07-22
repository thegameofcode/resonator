var _ = require('lodash');
var config = require('config');

module.exports = function() {

  return function checkUrl(req, res, next) {
    var path = req.path();
    var method = req.method;

    req.isPublic = _.some(config.get('auth.excludeAuthPaths'), function(pattern) {
      return path.match(new RegExp(pattern.endpoint, 'g')) && (pattern.method === method);
    });

    return next();
  };

};
