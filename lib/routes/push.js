var push = require('../platforms/push');
var errors = require('../util/errors');
var checkPushNotification = require('../middleware/check_push_notification');

var routes = {};

module.exports = function(server) {

    server.post('api/notification/push', checkPushNotification(), routes.sendPushNotification);
};


routes.sendPushNotification = function(req, res, next) {

    var identity = req.identity;

    if (!identity) {
        return next(new errors.BadRequestError('Unknown identity'));
    }

    push.sendPush(req.body, function(err, response) {

        if (err) {
            return next(new errors.InternalError('Could not send PUSH Notification to destination'));
        }

        res.send(200, response);
        return next();
    });
};