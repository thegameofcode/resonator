'use strict';
const _ = require('lodash');
const config = require('config');

module.exports = function() {

  return function checkUrl(req, res, next) {
    const path = req.path;
    const method = req.method;

    req.isPublic = _.some(config.get('auth.excludeAuthPaths'), function(pattern) {
      return path.match(new RegExp(pattern.endpoint, 'g')) && (!pattern.method || pattern.method === method);
    });

    return next();
  };

};
