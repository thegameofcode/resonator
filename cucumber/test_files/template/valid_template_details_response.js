'use strict';

'use strict';

module.exports = {
  stubbed: {
    error: null,
    output: {
      content: '<html><body><h1>Hello, {{USER}}!</h1></body></html>',
      placeholders: ['USER']
    }
  },
  result: {
    status: 200,
    body: {
      content: '<html><body><h1>Hello, {{USER}}!</h1></body></html>',
      placeholders: ['USER']
    }
  }
};
