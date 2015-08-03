var _ = require('lodash');

var errors = require('../util/errors');

module.exports = function() {
    return function checkEmail(req, res, next) {

        var notificationObj = req.body;

        if (_.isEmpty(notificationObj)) {
            return next(new errors.BadRequestError('Missing notification parameters'));
        }

        if (!notificationObj.to || _.isEmpty(notificationObj.to)) {
            return next(new errors.BadRequestError('Missing \'to\' property in parameters'));
        }

        if (!notificationObj.message || _.isEmpty(notificationObj.message)) {
            return next(new errors.BadRequestError('Missing \'message\' property in parameters'));
        }

        return next();
    };
};