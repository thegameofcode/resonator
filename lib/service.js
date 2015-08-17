var restify = require('restify');
var log = require(process.cwd() + '/lib/util/logger');
var validate_identity = require('./middleware/validate_identity');
var check_url = require('./middleware/check_url');

var ROUTES_FOLDER = process.cwd() + '/lib/routes/';


  var server;

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

    server.on('uncaughtException', function (req, res, router, error) {
      console.log(error.stack());
      log.error('UncaughtException', error);
    });

    /**
     * middlewares
    */
    //
    // APN Feedback Service
    //
    server.use(check_url());
    server.use(validate_identity());
    /* Routes */
    var routes = [
      'channel', 'device', 'heartbeat', 'identity', 'sms', 'push', 'email'
    ];

    routes.forEach(function loadRoutes(file) {
      require(ROUTES_FOLDER + file)(server);
      log.info('Router ' + file + ' loaded');
    });

module.exports = server;


