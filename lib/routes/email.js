var emailPlatform = require('../platforms/email');
var checkEmail = require('../middleware/check_email');
var validatePushRequest = require('../middleware/validate_push_request');
var orchestrator = require('../platforms/orchestrator');

var routes = {};

module.exports = function(server) {

    server.post('/api/notification/email', [validatePushRequest(), checkEmail()], routes.sendEmailNotification);
};

routes.sendEmailNotification = function(req, res, next) {

    orchestrator.sendNotification(req.body, emailPlatform, function(err) {

        if (err) {
            return next(err);
        }

        res.sendStatus(204);
    });
};
