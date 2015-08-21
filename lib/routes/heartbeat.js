var routes = {};

module.exports = function(server){

  server.get('/heartbeat', routes.listenHeartbeat);

};

routes.listenHeartbeat = function (req, res, next) {

  res.sendStatus(204);
  return next();
};
