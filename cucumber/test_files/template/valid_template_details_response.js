'use strict';

module.exports = {
  status: 200,
  data: {
    error: null,
    content: {
      html: '<html><body><h1>Hello, {{USER}}!</h1></body></html>',
      placeholders: ['USER']
    }
  }
};
