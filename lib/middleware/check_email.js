'use strict';
const _ = require('lodash');
const log = require('../util/logger');
const helper = require('../util/helper');
const errors = require('../util/errors');

module.exports = function() {
  return function checkEmail(req, res, next) {

    const emailObj = req.body.content;

    emailObj.subject = emailObj.subject || 'New echo';

    if (_.isEmpty(emailObj.from || !_.isString(emailObj.from) || !helper.isEmail(emailObj.from))) {
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
