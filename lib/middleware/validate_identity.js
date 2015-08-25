var errors = require('../util/errors');
var ObjectId = require('mongoose').Types.ObjectId;
var identities = require('../platforms/identity');
var log = require('../util/logger');

module.exports = function() {

  return function(req, res, next) {

    var err;

    if (req.isPublic) {
      return next();
    }

    /* x-user-id header must exist in request object with valid identity object ID */
    var identityId = req.headers['x-user-id'];

    if (!identityId) {
      log.error('Missing authorization header');
      //return next(new errors.UnauthorizedError('Missing authorization header'));
      err = new errors.UnauthorizedError('Missing authorization header');
      res.status(err.statusCode).json(err.body);
      return next(err);
    }

    if (!ObjectId.isValid(identityId)) {

      log.error('Invalid Authorization header format');
      err = new errors.InvalidHeaderError('Invalid Authorization header format');
      //return next(new errors.InvalidHeaderError('Invalid Authorization header format'));
      res.status(err.statusCode).json(err.body);
      return next(err);
    }

    identities.get(identityId, function(err, identity) {

      if (err) {
        return next(err);
      }

      if (!identity) {

        log.error('Identity not found');
        err = new errors.UnauthorizedError('Identity not found');
        res.status(err.statusCode).json(err.body);
        res.end();
        return next(err);
        //return next(new errors.UnauthorizedError('Identity not found'));
      } else {

        req.identity = identity;
      }

      return next();
    });
  };
};
