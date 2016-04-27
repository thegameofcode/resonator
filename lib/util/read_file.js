'use strict';

const fs = require('fs');
const errors = require('./errors');

module.exports = function(filepath) {
  const data = {};

  try {
    data.html = fs.readFileSync(filepath).toString();
    console.log('YOY');
    return data;
  } catch (err) {
    data.error = new errors.NotFoundError('HTML template not found');
    console.log('ERROR');
    return data;
  }
};
