var routes = {};

module.exports = function(server){

  server.get('/heartbeat', routes.listenHeartbeat);

};

routes.listenHeartbeat = function (req, res, next) {

  res.send(204);
  next();

};
