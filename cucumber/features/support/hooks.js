'use strict';

var mongoose = require('mongoose');
var config = require('config');
var async = require('async');
var sinon = require('sinon');

var log = require('../../../lib/util/logger');
var loadFixtures = require('../../../scripts/load_fixtures');

module.exports = function(){

	var service = require(process.cwd() + '/lib/service.js');
  var apnUtil = require('./../../../lib/util/apn');
  var gcmUtil = require('./../../../lib/util/gcm');
  var apnStub, gcmStub;

  this.World = require('./world.js').World;
  this.World.registerServer(service);

  /// BEFORE HOOKS
  this.BeforeFeatures(function(event, callback) {
    log.debug('Connecting to DB');
    mongoose.connect(config.get('db.conn'), callback);
  });

  this.Before(function(callback) {

    log.debug('Loading fixtures');
    loadFixtures(callback);

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

  // Hooks for @apn tag
  this.Before('@apn', function(callback) {
    apnStub = sinon.stub(apnUtil, 'pushNotification');
    apnStub.yields(null, {});
    return callback();
  });

  this.After('@apn', function(callback) {
    apnStub.restore();
    return callback();
  });

  this.Before('@gcm', function(callback) {
    gcmStub = sinon.stub(gcmUtil, 'sendGCM');
    gcmStub.yields(null, {});
    return callback();
  });

  this.After('@gcm', function(callback) {
    gcmStub.restore();
    return callback();
  });
};