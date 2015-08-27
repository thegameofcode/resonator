var orchestrator = require('../platforms/orchestrator');
var validatePushRequest = require('../middleware/validate_push_request');
var checkPushNotification = require('../middleware/check_push_notification');
var pushPlatform = require('../platforms/push');
var routes = {};

module.exports = function(server) {

    server.post('/api/notification/push', [validatePushRequest(), checkPushNotification()], routes.sendPushNotification);
};


routes.sendPushNotification = function(req, res, next) {

    orchestrator.sendPushNotifications(req.body, pushPlatform, function(err /*, response */) {

        if (err) {
            return next(err);
        }

        res.sendStatus(204);
    });
};