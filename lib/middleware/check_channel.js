var _ = require('lodash');

var errors = require('../util/errors');

module.exports = function() {
  return function check_channel(req, res, next) {

    var channelObj = req.body;

    if (_.isEmpty(channelObj)) {
      return next(new errors.BadRequestError('Missing channel object'));
    }

    if (!channelObj.name || _.isEmpty(channelObj.name)) {
      return next(new errors.ConflictError('Missing \'name\' property in channel object'));
    }

    return next();
  };
};