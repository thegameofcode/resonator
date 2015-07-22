'use strict';

var mongoose = require('mongoose');
var config = require('config');
var async = require('async');

var log = require('../../../lib/util/logger');

module.exports = function(){

	var service = require(process.cwd() + '/lib/service.js');

  this.World = require('./world.js').World;
  this.World.registerServer(service);

  /// BEFORE HOOKS
  this.BeforeFeatures(function(event, callback) {
    log.debug('Connecting to DB');
    mongoose.connect(config.get('db.conn'), callback);
  });

  /// AFTER HOOKS
  this.AfterFeatures(function(event, callback) {

    async.series([

      function dropData(done) {
        log.debug('Dropping database...');
        mongoose.connection.db.dropDatabase(done);
      },

      function disconnect(done) {
        log.debug('Disconnected from MongoDB');
        mongoose.disconnect(done);
      }

    ], callback);

  });
};