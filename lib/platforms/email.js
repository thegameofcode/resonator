var request = require('request');
var config = require('config');

module.exports = {
    sendEmail: sendEmailNotification
};

function sendEmailNotification(body, callback) {

    MAILGUN_MESSAGES_URL = 'https://api.mailgun.net/v3/' + config.get('mailer.mailgun.domain') + '/messages';

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
            pass: config.mailer.mailgun.apiKey,
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
