'uhtmlse strict';

const fs = require('fs');
const errors = require('./errors');

module.exports = function(filepath) {
  const data = {};

  try {
    data.content = fs.readFileSync(filepath).toString();
    return data;
  } catch (err) {
    data.error = new errors.NotFoundError('HTML template not found');
    return data;
  }
};
