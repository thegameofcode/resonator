var emailPlatform = require('../platforms/email');
var errors = require('../util/errors');
var checkEmail = require('../middleware/check_email');
var orchestrator = require('../platforms/orchestrator');

var routes = {};

module.exports = function(server) {

    server.post('/api/notification/email', checkEmail(), routes.sendEmailNotification);
};

routes.sendEmailNotification = function(req, res, next) {

    var identity = req.identity;

    if (!identity) {
        return next(new errors.BadRequestError('Unknown identity'));
    }

    orchestrator.sendNotification(req.body, emailPlatform, function(err, output) {

        if (err) {
            return next(err);
        }

        req.log.info({res: output.response}, 'mail_sent');
        res.send(200, output.body);
        return next();
    });
};
