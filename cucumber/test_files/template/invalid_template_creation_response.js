'use strict';
const errors = require('../../../lib/util/errors');

module.exports = {
  status: 400,
  data: {
    error: new errors.BadRequestError('Creation error'),
    content: {
      output: 'done'
    }
  }
};
