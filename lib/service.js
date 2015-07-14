var restify = require('restify');
var log = require(process.cwd() + '/lib/util/logger');
var validate_identity = require('./middleware/validate_identity');

var ROUTES_FOLDER = process.cwd() + '/lib/routes/';

module.exports = function (options) {
  var server = null;

  function stop(cbk) {
    server.close(function () {
      cbk();
    });
  }

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

    server.on('after', function (req, res) {
      var timing = Date.now() - new Date(req._time);

      if(res._data){
        console.log('< ', res.statusCode, res._data.length, 'bytes', timing, 'ms');
      } else {
        console.log('< ', res.statusCode, 'empty response', timing, 'ms');
      }
    });


    /**
     * middlewares
     */
    server.use(validate_identity());

    /* Routes */
    var routes = [
      'channel', 'device', 'heartbeat', 'identity', 'notification'
    ];

    routes.forEach(function loadRoutes(file) {
      require(ROUTES_FOLDER + file)(server);
      log.info('Router ' + file + ' loaded');
    });

    server.listen(options.port, function () {
      console.log("service is listening on port", options.port);
      cbk();
    });
  }

  var service = {
    start: start,
    stop: stop
  };
  return service;
};


