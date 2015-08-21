var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var log = require(process.cwd() + '/lib/util/logger');
var validate_identity = require('./middleware/validate_identity');
var check_url = require('./middleware/check_url');
var errors = require('./util/errors');
var ROUTES_FOLDER = process.cwd() + '/lib/routes/';


var server;

server = express({
  name: 'test-server'
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(methodOverride());
server.use(function (req, res, next) {
  log.info('> ' + req.method + ' ' + req.url);
  next();
});

server.on('after', function (req, res) {
  var timing = Date.now() - new Date(req._time);

  if(res._data){
    log.info('< ', res.statusCode, res._data.length, 'bytes', timing, 'ms');
  } else {
    log.info('< ', res.statusCode, 'empty response', timing, 'ms');
  }
});

server.on('uncaughtException', function (req, res, router, error) {
  log.error('UncaughtException', error);
});

/* middlewares */
server.use(check_url());
server.use(validate_identity());

/* Routes */
var routes = ['channel', 'device', 'heartbeat', 'identity', 'sms', 'push', 'email'];

routes.forEach(function loadRoutes(file) {
  require(ROUTES_FOLDER + file)(server);
  log.info('Router ' + file + ' loaded');
});

server.use(logErrors);
server.use(errorHandler);

function logErrors(err, req, res, next) {
  log.error(err.stack);
  next(err);
}

function errorHandler(err, req, res) {

  if (err instanceof errors.HttpError) {
    res.status(err.statusCode).json(err.body);
    return;
  }

  res.status(500).json({code: 'InternalError', message: err.message || 'Fatal error'});
}

module.exports = server;
