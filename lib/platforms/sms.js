var request = require('request');

module.exports = function (options) {

	function send(phone, text, cbk) {
		var callOptions = {
			url: options.sms.mainUrl + options.sms.accountSid + options.sms.sendSmsPath,
			headers: {
				'Authorization': 'Basic ' + options.sms.authToken
			},
			method: 'POST',
			form: {
				From: options.sms.fromPhone,
				To: phone,
				Body: text
			}
		};

		console.log('=> ' + options.url);
		request(callOptions, function (err, res, body) {
			if (err) {
				debug('err:', err);
				return cbk(err);
			}

			console.log('<= ' + res.statusCode + ' ' + body);
			if (res.statusCode === 400) {
				body = JSON.parse(body);
				cbk({err: body.code, des: body.message});
			} else {
				cbk();
			}
		});
	}

	var service = {
		send: send
	};
	return service;
};