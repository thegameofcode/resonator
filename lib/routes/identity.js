var identities = require('../platforms/identity');
var errors = require('../util/errors');
var routes = {};

module.exports = function(server) {

  server.get('/api/identity', routes.getIdentity);
  server.put('/api/identity', routes.updateIdentity);
  server.post('/api/identity', routes.createIdentity);
  server.get('/api/identity/:identityId', routes.getIdentityById);
  server.put('/api/identity/:identityId', routes.updateIdentityById); // This one does not make sense, or does it?

};

routes.getIdentity = function(req, res, next) {

  var identity = req.identity;

  if (!identity) {
    return next(new errors.BadRequestError('Unknown identity'));
  }

  var formattedIdentity = identities.formatIdentity(identity);

  res.send(200, formattedIdentity);
  return next();
};

routes.createIdentity = function(req, res, next) {

  identities.createIdentity(req.body, function(err, createdIdentityId) {

    if (err) {
      return next(new errors.ConflictError('Could not create requested Identity object'));
    }

    req.log.info('new identity registered', createdIdentityId);
    res.send(201, {id: createdIdentityId});
    return next();
  });
};

routes.updateIdentity = function(req, res, next) {

  var identityObj = req.identity;

  if (!identityObj) {
    return next(new errors.BadRequestError('Unknown identity'));
  }

  identities.updateIdentityData(identityObj, req.body, function(err) {

    if (err) {
      return next(new errors.BadRequestError('Could not update identity data'));
    }

    res.send(204);
    return next();
  });

};

routes.getIdentityById = function(req, res, next) {

  var identityId = req.params.identityId;

  if (!identityId) {
    return next(new errors.InvalidArgumentError('Missing identity id parameter'));
  }

  identities.get(identityId, function(err, foundIdentity) {

    if (err) {
      return next(new errors.NotFoundError('Could not find identity for provided identifier'));
    }

    if (!foundIdentity) {
      return next(new errors.NotFoundError('No identity found for provided identifier'));
    }

    var formattedIdentity = identities.formatIdentity(foundIdentity);
    res.send(200, formattedIdentity);
    return next();
  });
};

routes.updateIdentityById = function(req, res, next) {

  // Get identity from params
  // Update properties of identity via manager
  return next();
};
