var routes = {};

module.exports = function(server) {

  server.get('/api/identity/:identityId/device', routes.getDevices);
  server.get('/api/identity/:identityId/device/:type', routes.getFilteredDevices);
  server.post('/api/identity/:identityId/phone/:type', routes.addDeviceToIdentity);

};

routes.getDevices = function(req, res, next) {

  // Check for identity existence
  // Retrieve devices info for the given identity id
  return next();
};

routes.getFilteredDevices = function(req, res, next) {

  // Check for identityId existence
  // Retrieve devices for the given identity based on TYPE
  return next();
};

routes.addDeviceToIdentity = function(req, res, next) {

  // Check for identityId existence
  // Add new device to given identity's device list with the specified type
  return next();
};
