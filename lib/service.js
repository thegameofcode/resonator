var restify = require('restify');

module.exports = function (options) {
	var server = null;

	function start(cbk) {

		//var sms = require(process.cwd() + '/lib/platforms/sms.js')(options);

		server = restify.createServer({
			name: 'test-server'
		});

		server.use(restify.bodyParser());
		server.use(function (req, res, next) {
			console.log('> ' + req.method + ' ' + req.url);
			next();
		});

		server.on('after', function (req, res, route) {
			var timing = Date.now() - new Date(req._time);
			console.log('< ', route, res.statusCode, res._data, timing, 'ms');
		});

		require(process.cwd() + '/lib/routes/heartbeat.js')(server);
		require(process.cwd() + '/lib/routes/notification/sms.js')(server);

		server.listen(options.port, function () {
			console.log("service is listening on port", options.port);
			cbk();
		});
	}

	function stop(cbk) {
		server.close(function () {
			cbk();
		});
	}

	var service = {
		start: start,
		stop: stop
	};
	return service;
};


