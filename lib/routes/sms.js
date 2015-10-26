'use strict';
const smsPlatform = require('../platforms/sms');
const checkSms = require('../middleware/check_sms');
const validatePushRequest = require('../middleware/validate_push_request');
const orchestrator = require('../platforms/orchestrator');

let routes = {};

routes.sendSmsNotification = function(req, res, next) {

  orchestrator.sendNotification(req.body, smsPlatform, function(err /* response */) {

    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
};

module.exports = function(server) {
  server.post('/api/notification/sms', [validatePushRequest(), checkSms()], routes.sendSmsNotification);
};
