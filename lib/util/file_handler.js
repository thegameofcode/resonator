'uhtmlse strict';

const fs = require('fs');
const errors = require('./errors');

function readFile(filepath) {
  const data = {};

  try {
    data.content = fs.readFileSync(filepath).toString();
    return data;
  } catch (err) {
    data.error = new errors.NotFoundError('Template not found');
    return data;
  }
}

module.exports = {
  readFile: readFile
};
