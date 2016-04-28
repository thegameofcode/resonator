'use strict';

module.exports = {
  stubbed: {
    error: {
      code: 'InternalError',
      message: 'Read error'
    },
    output: undefined
  },
  result: {
    status: 500,
    body: {
      code: 'InternalError',
      message: 'Read error'
    }
  }
};
