var errors = require('../util/errors');
var ObjectId = require('mongoose').Types.ObjectId;
var identities = require('../platforms/identity');
var log = require('../util/logger');

module.exports = function() {

  return function(req, res, next) {

    if (req.isPublic) {
      return next();
    }

    /* x-user-id header must exist in request object with valid identity object ID */
    var identityId = req.headers['x-user-id'];

    if (!identityId) {

      log.error('Missing authorization header');
      return next(new errors.UnauthorizedError('Missing authorization header'));
    }

    if (!ObjectId.isValid(identityId)) {

      log.error('Invalid Authorization header format');
      return next(new errors.InvalidHeaderError('Invalid Authorization header format'));
    }

    identities.get(identityId, function(err, identity) {

      if (err) {
        return next(err);
      }

      if (!identity) {

        log.error('Identity not found');
        return next(new errors.UnauthorizedError('Identity not found'));
      } else {

        req.identity = identity;
      }

      return next();
    });
  };
};
