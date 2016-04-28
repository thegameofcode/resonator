'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const log = require(process.cwd() + '/lib/util/logger');
const validateIdentity = require('./middleware/validate_identity');
const checkUrl = require('./middleware/check_url');
const errors = require('./util/errors');
const ROUTES_FOLDER = process.cwd() + '/lib/routes/';


let server;

server = express({
  name: 'test-server'
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(methodOverride());
server.use(function(req, res, next) {
  log.info('> ' + req.method + ' ' + req.url);
  next();
});

server.on('after', function(req, res) {
  const timing = Date.now() - new Date(req._time);

  if (res._data) {
    log.info('< ', res.statusCode, res._data.length, 'bytes', timing, 'ms');
  } else {
    log.info('< ', res.statusCode, 'empty response', timing, 'ms');
  }
});

server.on('uncaughtException', function(req, res, router, error) {
  log.error('UncaughtException', error);
});

/* middlewares */
server.use(checkUrl());
server.use(validateIdentity());

/* Routes */
const routes = ['channel', 'heartbeat', 'identity', 'sms', 'push', 'email', 'template'];

routes.forEach(function loadRoutes(file) {
  require(ROUTES_FOLDER + file)(server);
  log.info('Router ' + file + ' loaded');
});

function logErrors(err, req, res, next) {
  log.error(err.stack);
  next(err);
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars

  if (err instanceof errors.HttpError) {
    res.status(err.statusCode).json(err.body);
  }

  res.status(500).json({code: 'InternalError', message: err.message || 'Fatal error'});
  return;
}

server.use(logErrors);
server.use(errorHandler);

module.exports = server;
