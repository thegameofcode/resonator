var _ = require('lodash');
var helper = require('../util/helper');
var errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    var emailObj = req.body.content;

    emailObj.subject = emailObj.subject || 'New echo';

    if (_.isEmpty(emailObj.from || !_.isString(emailObj.from) || !helper.isEmail(emailObj.from))) {
      return next(new errors.BadRequestError('Missing \'from\' property in parameters'));
    }

    if (_.isEmpty(emailObj.message) || !_.isString(emailObj.message)) {
      return next(new errors.BadRequestError('Missing \'message\' String property in request body \'content\' object'));
    }

    return next();
  };
};