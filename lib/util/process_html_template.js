'use strict';

const path = require('path');
const _ = require('lodash');
const fileHandler = require('./file_handler');
const generateFilenameWithExt = require('./generate_filename_with_ext');

const HTML_TEMPLATES_BASE_PATH = path.join(__dirname, '../../templates/html/');

module.exports = function(templateData) {

  let filename = generateFilenameWithExt(templateData.filename, 'html');
  const filepath = path.join(HTML_TEMPLATES_BASE_PATH, filename);
  let htmlData = fileHandler.readFile(filepath);

  if (htmlData.content) {
    const placeholderData = templateData.placeholders;
    const placeholderKeys = _.keys(placeholderData);

    _.each(placeholderKeys, function(placeholderKey) {
      htmlData.content = htmlData.content.replace('{{' + placeholderKey + '}}', placeholderData[placeholderKey], 'g');
    });
  }

  return htmlData;
};
