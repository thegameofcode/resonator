'use strict';
const identities = require('../platforms/identity');
const errors = require('../util/errors');
let routes = {};

routes.getIdentity = function(req, res, next) {

  const identity = req.identity;

  if (!identity) {
    return next(new errors.BadRequestError('No identity provided'));
  }

  const formattedIdentity = identities.formatIdentity(identity);

  res.status(200).send(formattedIdentity);
};

routes.createIdentity = function(req, res, next) {

  identities.createIdentity(req.body, function(err, createdIdentityId) {

    if (err) {
      return next(err);
    }

    res.status(201).send({id: createdIdentityId});
  });
};

routes.updateIdentity = function(req, res, next) {

  const identityObj = req.identity;

  if (!identityObj) {
    return next(new errors.BadRequestError('Unknown identity'));
  }

  identities.updateIdentityData(identityObj, req.body, function(err) {

    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });

};

routes.getIdentityById = function(req, res, next) {

  const identityId = req.params.identityId;

  if (!identityId) {
    return next(new errors.InvalidArgumentError('Missing identity id parameter'));
  }

  identities.get(identityId, function(err, foundIdentity) {

    if (err) {
      return next(err);
    }

    if (!foundIdentity) {
      return next(new errors.NotFoundError('No identity found for provided identifier'));
    }

    const formattedIdentity = identities.formatIdentity(foundIdentity);
    res.status(200).send(formattedIdentity);
  });
};


module.exports = function(server) {
  server.get('/api/identity', routes.getIdentity);
  server.put('/api/identity', routes.updateIdentity);
  server.post('/api/identity', routes.createIdentity);
  server.get('/api/identity/:identityId', routes.getIdentityById);
};
