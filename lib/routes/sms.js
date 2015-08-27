var smsPlatform = require('../platforms/sms');
var checkSms = require('../middleware/check_sms');
var validatePushRequest = require('../middleware/validate_push_request');
var orchestrator = require('../platforms/orchestrator');

var routes = {};

module.exports = function(server) {
    server.post('/api/notification/sms', [validatePushRequest(), checkSms()], routes.sendSmsNotification);
};

routes.sendSmsNotification = function(req, res, next) {

    orchestrator.sendNotification(req.body, smsPlatform, function(err/*, response */) {

        if (err) {
            return next(err); // Controlled error
        }

        res.sendStatus(204);
    });
};