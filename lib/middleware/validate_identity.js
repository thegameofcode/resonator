var errors = require('../util/errors');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function() {

  return function(req, res, next) {

    /* x-user-id header must exist in request object with valid identity object ID */
    var identityId = req.headers['x-user-id'];

    if (!identityId) {
      return next(new errors.UnauthorizedError('Missing authorization header'));
    }

    if (!ObjectId.isValid(identityId)) {
      return next(new errors.InvalidHeaderError('Invalid Authorization header'));
    }

    //TODO: find Identity object and assign it to req object
    return next();

  };

};
