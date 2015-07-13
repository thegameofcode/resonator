var routes = {};

module.exports = function(server) {

  server.get('/api/me', routes.getIdentity);
  server.post('/api/me', routes.updateIdentity);
  server.get('/api/identity/:identityId', routes.getIdentityById);
  server.put('/api/identity/:identityId', routes.updateIdentityById);

};

routes.getIdentity = function(req, res, next) {

  // Get user from x-user-id header
  // Call function from manager to obtain identity data
  return next()
};

routes.updateIdentity = function(req, res, next) {

  // Get identity id from x-user-id header
  // Update identity properties via manager
  return next();
};

routes.getIdentityById = function(req, res, next) {

  // Get identity id from params
  // Retrieve identity via manager
  return next();
};

routes.updateIdentityById = function(req, res, next) {

  // Get identity from params
  // Update properties of identity via manager
  return next();
};
