'use strict';
const mongoose = require('mongoose');
const config = require('config');
const async = require('async');
const sinon = require('sinon');

const log = require('../../../lib/util/logger');
const loadFixtures = require('../../../scripts/load_fixtures');

module.exports = function() {

  const service = require(process.cwd() + '/lib/service');
  let apnUtil = require('./../../../lib/transport/apn');
  let gcmUtil = require('./../../../lib/transport/gcm');
  let apnStub, gcmStub;

  this.World = require('./world.js').World;
  this.World.registerServer(service);

  // BEFORE HOOKS
  this.BeforeFeatures(function(event, callback) {
    log.debug('Connecting to DB');
    mongoose.connect(config.get('db.conn'), callback);
  });

  this.Before(function(callback) {

    log.debug('Loading fixtures');
    loadFixtures(callback);

  });
  // AFTER HOOKS
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
