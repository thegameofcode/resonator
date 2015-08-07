var _ = require('lodash');
var log = require('../util/logger');

var errors = require('../util/errors');

module.exports = function() {
    return function checkEmail(req, res, next) {

        var notificationObj = req.body;

        if (_.isEmpty(notificationObj)) {

            log.error('Missing notification parameter', notificationObj);
            return next(new errors.BadRequestError('Missing notification parameters'));
        }

        if (!notificationObj.to || _.isEmpty(notificationObj.to)) {

            log.error('Missing \'to\' property in parameters', notificationObj);
            return next(new errors.BadRequestError('Missing \'to\' property in parameters'));
        }

        if (!notificationObj.message || _.isEmpty(notificationObj.message)) {

            log.error('Missing \'message\' property in parameters', notificationObj);
            return next(new errors.BadRequestError('Missing \'message\' property in parameters'));
        }

        return next();
    };
};