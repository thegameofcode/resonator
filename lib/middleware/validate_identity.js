'use strict';
const ObjectId = require('mongoose').Types.ObjectId;

const errors = require('../util/errors');
const identities = require('../platforms/identity');
const log = require('../util/logger');

module.exports = function() {

  return function(req, res, next) {

    let err;

    if (req.isPublic) {
      return next();
    }

    /* x-user-id header must exist in request object with valid identity object ID */
    const identityId = req.headers['x-user-id'];

    if (!identityId) {
      log.error('Missing authorization header');
      err = new errors.UnauthorizedError('Missing authorization header');
      res.status(err.statusCode).json(err.body);
      return next(err);
    }

    if (!ObjectId.isValid(identityId)) {

      log.error('Invalid Authorization header format');
      err = new errors.InvalidHeaderError('Invalid Authorization header format');
      res.status(err.statusCode).json(err.body);
      return next(err);
    }

    identities.get(identityId, function(err, identity) {

      if (err) {
        return next(err);
      }

      if (!identity) {
        return next(new errors.UnauthorizedError('Identity not found'));
      }

      req.identity = identity;

      return next();
    });
  };
};
