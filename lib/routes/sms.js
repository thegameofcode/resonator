var smsPlatform = require('../platforms/sms');
var errors = require('../util/errors');
var checkSms = require('../middleware/check_sms');
var orchestrator = require('../platforms/orchestrator');

var routes = {};

module.exports = function(server) {

    server.post('api/notification/sms', checkSms(), routes.sendSmsNotification);
};

routes.sendSmsNotification = function(req, res, next) {

    var identity = req.identity;

    if (!identity) {
        return next(new errors.BadRequestError('Unknown identity'));
    }

    orchestrator.sendNotification(req.body, smsPlatform, function(err, response) {

        if (err) {
            return next(new errors.InternalError('Could not send SMS to destination'));
        }

        res.send(200, response.body);
        return next();
    });
};