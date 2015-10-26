'use strict';
const orchestrator = require('../platforms/orchestrator');
const validatePushRequest = require('../middleware/validate_push_request');
const checkPushNotification = require('../middleware/check_push_notification');
const pushPlatform = require('../platforms/push');
let routes = {};

routes.sendPushNotification = function(req, res, next) {

  orchestrator.sendPushNotifications(req.body, pushPlatform, function(err /* response */) {

    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
};

module.exports = function(server) {
  server.post('/api/notification/push', [validatePushRequest(), checkPushNotification()], routes.sendPushNotification);
};
