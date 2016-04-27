'use strict';
const config = require('config');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const convertMjmlToHtml = require('../util/convert_mjml_to_html');
const processHtmlTemplate = require('../util/process_html_template');
const readFile = require('../util/read_file');
const log = require('../util/logger');
const transport = require('../transport/mailgun');

const PLACEHOLDER_REGEX = /\{\{([^}]+)\}\}/g;
const BATCH_LIMIT = config.get('platform_batch_limits.mailgun');
const CUSTOM_BATCH_LIMIT = config.get('transport.mailgun.batch_limit') || BATCH_LIMIT;

function sendEmailNotification(identities, body, callback) {

  let emails;
  let content;

  emails = _.flatten(_.map(identities, function(identity) {
    return identity.devices.email;
  }));
  content = body.content;

  if (content.mjml) {
    const readHtml = processHtmlTemplate(content.mjml);

    if (readHtml.error) {
      return callback(readHtml.error);
    }
    content.message = readHtml.html;
  }
  
  log.info('Sending request to send emails', emails, content);

  transport.send(emails, content, function(err, response, body) {
    if (err) {
      return callback(err);
    }

    const output = {
      response: response,
      body: body
    };

    log.info('Receiving response from email request');
    log.debug('Receiving response from email request', body);

    return callback(null, output);
  });
}

function sendSingleEmail(body, callback) {

  const emails = body.to;
  const content = body;
  content.subject = body.subject;

  if (content.mjml) {
    const readHtml = processHtmlTemplate(content.mjml);
    
    if (readHtml.error) {
      return callback(readHtml.error);
    }
    content.message = readHtml.html;
  } else {
    content.message = content.html;
  }

  log.info('Sending request to sendSingleEmail', emails, content);

  transport.send(emails, content, function(err, response, body) {
    if (err) {
      return callback(err);
    }

    const output = {
      response: response,
      body: body
    };

    log.info('Receiving response from email request');
    log.debug('Receiving response from email request', body);

    return callback(null, output);
  });
}

function generateHtmlFromMjml(body, callback) {

  const convertedMjml = convertMjmlToHtml(body.mjml);
  if (convertedMjml.error) {
    return callback(convertedMjml.error);
  }

  fs.writeFile(path.join(__dirname, '../../html/' + body.filename), convertedMjml.html, function(err) {

    if (err) {
      return callback(err);
    }

    return callback(null, {output: 'done'});
  });
}

function getListOfHtmlTemplates(callback) {

  fs.readdir(path.join(__dirname, '../../html'), function(err, files) {
    if (err) {
      return callback(err);
    }
    
    return callback(null, files);
  });
}

function getHtmlTemplateDetails(filename, callback) {
  
  const data = readFile(path.join(__dirname, '../../html/' + filename));
  if (data.error) {
    return callback(data.error);
  }
  
  const placeholders = data.html.match(PLACEHOLDER_REGEX);
  
  const res = {
    html: data.html,
    placeholders: placeholders
  };
  
  return callback(null, res);
}
const emailOptions = {
  resourceName: 'devices.email',
  batchLimit: _.min([BATCH_LIMIT, CUSTOM_BATCH_LIMIT]),
  projectionOptions: {'devices.email': 1}
};

module.exports = {
  send: sendEmailNotification,
  sendSingleEmail: sendSingleEmail,
  generateHtmlFromMjml: generateHtmlFromMjml,
  getListOfHtmlTemplates:getListOfHtmlTemplates,
  getHtmlTemplateDetails: getHtmlTemplateDetails,
  options: emailOptions
};
