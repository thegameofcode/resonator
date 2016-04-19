var config = require('config');
var mongoose = require('mongoose');

var log = require('../lib/util/logger');
var service = require('../lib/service');

var options = {
  port: process.env.PORT || config.get('port')
};

/* MongoDB */
env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  mongoose.set('debug', true);
}

log.info('Connecting to MongoDB...');
mongoose.connect(config.get('db.conn'), function(err) {
  if (err) throw err;
  log.info('Connected to MongoDB');

  mongoose.connection.on('error', function(err) {
    log.error(err);
  });

  mongoose.connection.on('disconnected', function(err) {
    log.error('Disconnected from MongoDB', err);
  });

  /* Server */
  service.listen(options.port, function() {
    log.info('service is listening on port', options.port);
  });
});
