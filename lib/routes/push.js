var orchestrator = require('../platforms/orchestrator');
var checkPushNotification = require('../middleware/check_push_notification');
var pushPlatform = require('../platforms/push');
var routes = {};

module.exports = function(server) {

    server.post('api/notification/push', checkPushNotification(), routes.sendPushNotification);
};


routes.sendPushNotification = function(req, res, next) {

    orchestrator.sendPushNotifications(req.body, pushPlatform, function(err /*, response */) {

        if (err) {
            return next(new errors.InternalError('Could not send PUSH Notification to destination'));
        }

        res.send(204);
        return next();
    });
};