var request = require('request');
var config = require('config');

var services_config = require(process.cwd() + '/config/external_services');

module.exports = {
    sendEmail: sendEmailNotification
};

function sendEmailNotification(body, callback) {

    var MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + services_config.mailer.mailgun.domain + '/messages';

    if (process.env.NODE_ENV === 'test') {
        MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + config.get('external.mailer.mailgun.domain') + '/messages';
    }

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
        json:true,
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
