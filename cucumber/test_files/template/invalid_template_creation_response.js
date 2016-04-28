'use strict';

const errors = require('../../../lib/util/errors');

module.exports = {
  stubbed: {
    error: new errors.BadRequestError('Missing or invalid parameters: content, filename, type'),
    output: undefined
  },
  result: {
    status: 400,
    body: {
      code: 'BadRequestError',
      message: 'Missing or invalid parameters: content, filename, type'
    }
  }
};
