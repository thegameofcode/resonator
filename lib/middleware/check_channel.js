var _ = require('lodash');

var errors = require('../util/errors');

module.exports = function() {
  return function checkChannel(req, res, next) {

    var channelObj = req.body;

    if (_.isEmpty(channelObj)) {
      return next(new errors.BadRequestError('Missing channel object'));
    }

    if (_.isEmpty(channelObj.name) || !_.isString(channelObj.name)) {
      return next(new errors.BadRequestError('Missing \'name\' String property in channel object'));
    }

    return next();
  };
};