'use strict';

const _ = require('lodash');
const templatePlatform = require('../platforms/template');
const errors = require('../util/errors');

const VALID_TEMPLATE_TYPES = ['mjml'];
let routes = {};

routes.createEmailTemplate = function(req, res, next) {

  const content = req.body.content;
  let filename = req.body.filename;
  const type = req.body.type;

  if (!content || !filename || !type || !_.includes(VALID_TEMPLATE_TYPES, type)) {
    return new errors.BadRequestError('Missing or invalid parameters: content, filename, type');
  }

  const input = {
    filename: filename,
    content: content,
    type: type
  };

  templatePlatform.generateHtmlTemplate(input, function(err, output) {
    if (err) {
      return next(err);
    }

    res.send(output);
  });
};

routes.listHtmlTemplates = function(req, res, next) {

  templatePlatform.getListOfHtmlTemplates(function(err, files) {
    if (err) {
      return next(err);
    }

    const fileList = files.map(function(file) {
      return file.replace('.html', '');
    });

    res.send(fileList);
  });
};

routes.getTemplateDetails = function(req, res, next) {

  let templateName = req.params.templateName;
  let templateType = req.params.type;

  if (!templateName || !templateType) {
    return new errors.BadRequestError('Missing template name and/or type');
  }

  templatePlatform.getTemplateDetails(templateName, templateType, function(err, details) {
    if (err) {
      return next(err);
    }

    res.send(details);
  });
};

module.exports = function(server) {
  server.post('/api/notification/email/template', routes.createEmailTemplate);
  server.get('/api/notification/email/template/list', routes.listHtmlTemplates);
  server.get('/api/notification/email/template/:templateName.:type', routes.getTemplateDetails);
};
