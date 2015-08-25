var errors = require('../util/errors');
var ObjectId = require('mongoose').Types.ObjectId;
var identities = require('../platforms/identity');

module.exports = function() {

  return function(req, res, next) {

    if (req.isPublic) {
      return next();
    }

    /* x-user-id header must exist in request object with valid identity object ID */
    var identityId = req.headers['x-user-id'];

    if (!identityId) {
      return next(new errors.UnauthorizedError('Missing authorization header'));
    }

    if (!ObjectId.isValid(identityId)) {
      return next(new errors.InvalidHeaderError('Invalid Authorization header format'));
    }

    identities.get(identityId, function(err, identity) {

      if (err) {
        return next(err);
      }

      if (!identity) {
        return next(new errors.UnauthorizedError('Identity not found'));
      } else {

        req.identity = identity;
      }

      return next();
    });
  };
};
