'use strict';
let routes = {};

routes.listenHeartbeat = function(req, res, next) {

  res.sendStatus(204);
  return next();
};

module.exports = function(server) {
  server.get('/heartbeat', routes.listenHeartbeat);
};
