var config = require('config'),
  bunyan = require('bunyan'),
  fs = require('fs'),
  logger, options, streams,
  logDirectory = config.get('log.directory'),
  logFullPath = logDirectory + config.get('log.filename'),
defaultStreams = [{ stream: process.stdout }, { path: logFullPath }]
  ;

var dir = logDirectory;
if (!fs.existsSync(dir)){
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
