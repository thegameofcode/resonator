'use strict';

const errors = require('../../../lib/util/errors');

module.exports = {
  stubbed: {
    error: new errors.BadRequestError('Invalid template filename: must have the <basename>.<extension> format'),
    output: undefined
  },
  result: {
    status: 400,
    body: {
      code: 'BadRequestError',
      message: 'Invalid template filename: must have the <basename>.<extension> format'
    }
  }
};
