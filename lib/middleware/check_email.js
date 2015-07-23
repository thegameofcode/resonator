var _ = require('lodash');
var errors = require('../util/errors');
var helper = require('../util/helper');

module.exports = function() {
  return function checkEmail(req, res, next) {

    var emailObj = req.body;

    if (helper.isEmpty(emailObj)) {
      return next(new errors.BadRequestError('Missing email object'));
    }

    req.body.subject = req.body.subject || 'Default notification subject';


    if (!emailObj.to || _.isEmpty(emailObj.to)) {
      return next(new errors.ConflictError('Missing to field in email object'));
    }

    if (!emailObj.from || _.isEmpty(emailObj.from)) {
      return next(new errors.ConflictError('Missing from field in email object'));
    }

    if (!emailObj.message || _.isEmpty(emailObj.message)) {
      return next(new errors.ConflictError('Missing message field in email object'));
    }

    return next();
  };
};