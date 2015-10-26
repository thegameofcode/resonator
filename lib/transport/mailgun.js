'use strict';
const config = require('config');
const request = require('request');

const MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + config.get('transport.mailgun.domain') + '/messages';
const MAILGUN_PASS = config.get('transport.mailgun.apiKey');
const log = require('../util/logger');

function sendEmails(emails, content, callback) {

  const data = {
    to: emails,
    from: content.from,
    subject: content.subject,
    html: content.message
  };

  log.info('sendEmails', data, MAILGUN_MESSAGES_URL, MAILGUN_PASS);
  request({
    url: MAILGUN_MESSAGES_URL,
    method: 'POST',
    json: true,
    auth: {
      user: 'api',
      pass: MAILGUN_PASS,
      sendImmediately: true
    },
    formData: data

  }, callback);

}

module.exports = {
  send: sendEmails
};
