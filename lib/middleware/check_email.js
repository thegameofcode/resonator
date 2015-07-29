var _ = require('lodash');

var errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    var emailObj = req.body;

    if (_.isEmpty(emailObj)) {
      return next(new errors.BadRequestError('Missing email parameters'));
    }

    req.body.subject = req.body.subject || 'New echo';


    if (!emailObj.to || _.isEmpty(emailObj.to)) {
      return next(new errors.BadRequestError('Missing \'to\' property in parameters'));
    }

    if (!emailObj.from || _.isEmpty(emailObj.from)) {
      return next(new errors.BadRequestError('Missing \'from\' property in parameters'));
    }

    if (!emailObj.message || _.isEmpty(emailObj.message)) {
      return next(new errors.BadRequestError('Missing \'message\' property in parameters'));
    }

    return next();
  };
};