'use strict';
const config = require('config');
const _ = require('lodash');

const processHtmlTemplate = require('../util/process_html_template');
const log = require('../util/logger');
const transport = require('../transport/mailgun');

const BATCH_LIMIT = config.get('platform_batch_limits.mailgun');
const CUSTOM_BATCH_LIMIT = config.get('transport.mailgun.batch_limit') || BATCH_LIMIT;

function sendEmailNotification(identities, body, callback) {

  let emails;
  let content;

  emails = _.flatten(_.map(identities, function(identity) {
    return identity.devices.email;
  }));
  content = body.content;

  if (content.template) {
    const readHtml = processHtmlTemplate(content.template);

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

  if (content.template) {
    const readHtml = processHtmlTemplate(content.template);

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

const emailOptions = {
  resourceName: 'devices.email',
  batchLimit: _.min([BATCH_LIMIT, CUSTOM_BATCH_LIMIT]),
  projectionOptions: {'devices.email': 1}
};

module.exports = {
  send: sendEmailNotification,
  sendSingleEmail: sendSingleEmail,
  options: emailOptions
};
