'use strict';

module.exports = {
  stubbed: {
    error: null,
    output: [
      {
        name: 'template-1',
        type: 'html'
      },
      {
        name: 'template-2',
        type: 'html'
      },
      {
        name: 'template-3',
        type: 'html'
      }
    ]
  },
  result: {
    status: 200,
    body: [
      {
        name: 'template-1',
        type: 'html'
      },
      {
        name: 'template-2',
        type: 'html'
      },
      {
        name: 'template-3',
        type: 'html'
      }
    ]
  }
}
