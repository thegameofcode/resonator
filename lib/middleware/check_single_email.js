var _ = require('lodash');
var log = require('../util/logger');
var helper = require('../util/helper');
var config = require('config');
var errors = require('../util/errors');

module.exports = function() {
  return function checkSingleEmail(req, res, next) {

    var emailObj = req.body;

    emailObj.subject = emailObj.subject || config.get('transport.mailgun.subject');
    emailObj.from = emailObj.from || config.get('transport.mailgun.from');

    if (_.isEmpty(emailObj.to || !_.isString(emailObj.to) || !helper.isEmail(emailObj.to))) {
      log.error('Missing \'to\' property in parameters', emailObj);
      return next(new errors.BadRequestError('Missing \'to\' property in parameters'));
    }

    if (_.isEmpty(emailObj.html) || !_.isString(emailObj.html)) {
      log.error('Missing \'html\' String property in request body', emailObj);
      return next(new errors.BadRequestError('Missing \'html\' String property in request body'));
    }

    return next();
  };
};