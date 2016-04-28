'uhtmlse strict';

const fs = require('fs');
const errors = require('./errors');

const BASENAME_AND_EXTENSION_REGEX = /(.+?)\.([^.]*$|$)/;

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

function getFilenameInfo(filename) {
  return filename.match(BASENAME_AND_EXTENSION_REGEX);
}

module.exports = {
  readFile: readFile,
  getFilenameInfo: getFilenameInfo
};
