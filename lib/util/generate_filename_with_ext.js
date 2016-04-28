'use strict';

module.exports = function(filename, type) {
  const extension = type ? '.' + type : '';

  if (filename.indexOf(extension) === -1) {
    return filename + extension;
  }

  return filename;
};
