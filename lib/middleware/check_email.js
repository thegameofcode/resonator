var _ = require('lodash');
var log = require('../util/logger');

var errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    var reqBody = req.body;
    var emailObj = req.body.content;

    if (_.isEmpty(emailObj)) {

      log.error('Missing email parameter', emailObj);
      return next(new errors.BadRequestError('Missing email parameters'));
    }

    req.body.content.subject = req.body.content.subject || 'New echo';


    if ((!reqBody.identities && !reqBody.channels) || (_.isEmpty(reqBody.identities) && _.isEmpty(reqBody.channels)) ) {

      log.error('The request body must contain at least one target channel or identity', emailObj);
      return next(new errors.BadRequestError('The request body must contain at least one target channel or identity'));
    }

    if (!emailObj.from || _.isEmpty(emailObj.from)) {

      log.error('Missing \'from\' property in parameters', emailObj);
      return next(new errors.BadRequestError('Missing \'from\' property in parameters'));
    }

    if (!emailObj.message || _.isEmpty(emailObj.message)) {

      log.error('Missing \'message\' property in parameters', emailObj);
      return next(new errors.BadRequestError('Missing \'message\' property in parameters'));
    }

    return next();
  };
};