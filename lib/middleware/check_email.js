var _ = require('lodash');
var config = require('config');

var errors = require('../util/errors');
var helper = require('../util/helper');
var services_config = require( process.cwd() + '/config/external_services');


module.exports = function() {
  return function checkEmail(req, res, next) {

    var emailObj = req.body;

    if (helper.isEmpty(emailObj)) {
      return next(new errors.BadRequestError('Missing email object'));
    }

    req.body.subject = req.body.subject || 'New echo';


    if (!emailObj.to || _.isEmpty(emailObj.to)) {
      return next(new errors.ConflictError('Missing \'to\' property in email object'));
    }

    if (!emailObj.from || _.isEmpty(emailObj.from)) {
      return next(new errors.ConflictError('Missing \'from\' property in email object'));
    }

    if (!emailObj.message || _.isEmpty(emailObj.message)) {
      return next(new errors.ConflictError('Missing \'message\' property in email object'));
    }

    return next();
  };
};