var request = require('request');
var twilio = require('twilio');

var services_config = require( process.cwd() + '/config/external_services');
var messager = new twilio.RestClient(services_config.twilio.account_sid, services_config.twilio.auth_token);

module.exports = {
  sendEmail: sendEmailNotification,
  sendSms: sendSmsNotification
};

function sendEmailNotification(body, callback) {

  var MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + services_config.mailer.mailgun.domain + '/messages';

  // Format email object
  var data = {
    to: body.to,
    from: body.from,
    subject: body.subject,
    html: body.message
  };

  request({
    url: MAILGUN_MESSAGES_URL,
    method: 'POST',
    auth: {
      user: 'api',
      pass: services_config.mailer.mailgun.apiKey,
      sendImmediately: true
    },
    formData: data

  }, function (err, response, body) {
    if(err) {
      return callback(err);
    }

    var output = {
      response: response,
      body: body
    };

    return callback(null, output);
  });
}

function sendSmsNotification(body, callback) {

  // Format sms object
  var sms = {
    to: body.to,
    from: body.from,
    body: body.message
  };

  messager.sendSms(sms, function(err) {

    if (err) {
      return callback(err);
    }

    return callback();
  });
}