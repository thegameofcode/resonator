var _ = require('lodash');
var errors = require('../util/errors');

module.exports = function() {

  return function(req, res, next) {
    console.log('Start');
    if (!req.body) {
      return next(new errors.BadRequestError('Missing request body'));
    }

    var body = req.body;

    var validIdentities = (!_.isEmpty(body.identities) && _.isArray(body.identities));
    var validChannels = (!_.isEmpty(body.channels) && _.isArray(body.channels));

    if (!validIdentities && !validChannels) {
      return next(new errors.BadRequestError('There must exist at least one element in the \'identities\' OR \'channels\' ARRAYS'));
    }

    if (_.isEmpty(body.content)) {
      return next(new errors.BadRequestError('The request body must contain a non-empty \'content\' object'));
    }
    console.log('Passing validations');

    return next();
  };
};
