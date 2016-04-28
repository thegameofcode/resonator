'use strict';

const _ = require('lodash');
module.exports = function(placeholders, charsToSanitize) {

  const chars = charsToSanitize || [];
  let sanitizedPlaceholders = placeholders || [];

  _.each(chars, function(charGroup) {
    _.each(sanitizedPlaceholders, function(placeholder, idx) {
      sanitizedPlaceholders[idx] = placeholder.replace(charGroup, '');
    });
  });

  return sanitizedPlaceholders;
};
