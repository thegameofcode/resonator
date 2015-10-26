'use strict';
const config = require('config');
const bunyan = require('bunyan');
const fs = require('fs');
const logDirectory = config.get('log.directory');
const logFullPath = logDirectory + config.get('log.filename');
const defaultStreams = [{ stream: process.stdout }, { path: logFullPath }];

let logger;
let options;
let streams;

let dir = logDirectory;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}


switch (process.env.NODE_ENV) {
  case 'production':
    streams = [{ path: logFullPath }];
    break;
  case 'test':
  case 'test_ci':
    streams = [{ path: logFullPath }];
    break;

  default:
    streams = defaultStreams;
}

options = {
  level: config.get('log.level'),
  name: config.get('app.name'),
  streams: streams,
  serializers: bunyan.stdSerializers

};

logger = bunyan.createLogger(options);
logger._options = options;

module.exports = logger;
