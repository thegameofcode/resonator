var routes = {};

module.exports = function(server) {

  server.get('/api/channel', routes.getChannel);
  server.post('/api/channel', routes.createChannel);
  server.del('/api/channel/:channelId', routes.deleteChannel);
  server.put('api/channel/channelId', routes.updateChannel);
  server.get('api/channel/:channelId/identities', routes.getChannelIdentities);
  server.del('api/channel/:channelId/identities/:identityId', routes.deleteIdentityFromChannel);
};

routes.getChannel = function(req, res, next) {

  // Return all channels related to the identity given by the x-user-id
  return next();
};

routes.createChannel = function(req, res, next) {

  // Create new channel and return the new channel identity
  return next();
};

routes.deleteChannel = function(req, res, next) {

  // Delete channel based on provided channel id
  return next();
};

routes.updateChannel = function(req, res, next) {

  // Update channel properties based on request body contents
  return next();
};

routes.getChannelIdentities = function(req, res, next) {

  // Get channel identities based on provided channel id
  return next();

};

routes.deleteIdentityFromChannel = function(req, res, next) {

  // Check identity existence beforehand
  // Check channel existence beforehand
  // Delete identity from channel's identity list
  return next();
};
