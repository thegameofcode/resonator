var notifications = require('../platforms/notification');
var errors = require('../util/errors');
var checkEmail = require('../middleware/check_email');
var routes = {};

module.exports = function(server) {

  server.post('/api/push/email', checkEmail(), routes.sendEmailNotification);
};

routes.sendEmailNotification = function(req, res, next) {

  var identity = req.identity;

  if (!identity) {
    return next(new errors.BadRequestError('Unknown identity'));
  }

  notifications.sendEmailNotification(req.body, function(err, output) {

    if (err) {
      return next(new errors.InternalError('Could not send email to destination'));
    }

    req.log.info({res: output.response}, 'mail_sent');
    res.send(200, output.body);
    return next();
  });
};