var _ = require('lodash');
var log = require('../util/logger');

var errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    var emailObj = req.body.content;

    emailObj.subject = emailObj.subject || 'New echo';

    if (_.isEmpty(emailObj.from)) {
      log.error('Missing \'from\' property in parameters', emailObj);
      return next(new errors.BadRequestError('Missing \'from\' property in parameters'));
    }

    if (_.isEmpty(emailObj.message) || !_.isString(emailObj.message)) {
      log.error('Missing \'message\' String property in request body \'content\' object', emailObj);
      return next(new errors.BadRequestError('Missing \'message\' String property in request body \'content\' object'));
    }

    return next();
  };
};