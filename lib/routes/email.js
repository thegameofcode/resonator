'use strict';
const emailPlatform = require('../platforms/email');
const checkEmail = require('../middleware/check_email');
const checkSingleEmail = require('../middleware/check_single_email');
const validatePushRequest = require('../middleware/validate_push_request');
const orchestrator = require('../platforms/orchestrator');

let routes = {};

routes.sendEmailNotification = function(req, res, next) {

  orchestrator.sendNotification(req.body, emailPlatform, function(err) {
    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
};

routes.sendSingleEmail = function(req, res, next) {

  emailPlatform.sendSingleEmail(req.body, function(err) {
    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
};

module.exports = function(server) {
  server.post('/api/notification/email', [validatePushRequest(), checkEmail()], routes.sendEmailNotification);
  server.post('/api/notification/singleEmail', checkSingleEmail(), routes.sendSingleEmail);
};
