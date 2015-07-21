var routes = {};

module.exports = function(server) {

  server.post('/api/push/:type', routes.sendNotification);
};

routes.sendNotification = function(req, res, next) {

  // Check for identityId existence
  // Send push notification based on provided type
  return next();
};