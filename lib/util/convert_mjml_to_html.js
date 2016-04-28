'use strict';
const mjml2html = require('mjml').mjml2html;
const errors = require('./errors');

module.exports = function(mjmlBody) {

  const res = {};
  try {
    res.html = mjml2html(mjmlBody);
    return res;
  } catch (err) {
    res.error = new errors.BadRequestError(err.message);
    return res;
  }
};
