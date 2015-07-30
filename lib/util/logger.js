var config = require('config'),
  bunyan = require('bunyan'),
  logger, options, streams,
  defaultStreams = [{ stream: process.stdout }, { path: config.get('log.path') }];

switch (process.env.NODE_ENV) {
  case 'production':
    streams = [{ path: config.get('log.path') }];
    break;
  case 'test':
  case 'test_ci':
    streams = [{ path: config.get('log.path') }];
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
