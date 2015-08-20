var config = require('config');
var request = require('request');

var MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + config.get('transport.mailgun.domain') + '/messages';
var MAILGUN_PASS = config.get('transport.mailgun.apiKey');

function sendEmails(emails, content, callback) {

  var data = {
    to: emails,
    from: content.from,
    subject: content.subject,
    html: content.message
  };

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
