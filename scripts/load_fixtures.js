var mongoose = require('mongoose');
var async = require('async');
var config = require('config');

var log = require('../lib/util/logger');

// Loading mongoose models
require('../lib/models');

/*
 * Objects for `async.eachSeries`
 */

// Array of fixtures to iterate over
var fixtures = [];

// Function to apply to each fixture
var addFixture = function(fixture, callback) {
  var modelName = Object.keys(fixture)[0];
  var Model = mongoose.model(modelName);

  var data = fixture[modelName];

  // Support for mongoexport command
  switch (modelName) {
    case 'Identity':
      data._id = data._id.$oid || data._id;
      break;
  }

  var doc = new Model(data);

  // Adding fixture if it didn't exist
  doc.save(function(err) {

    if (err) {
      return callback(err);
    }

    if (!modelName.match(/(identity)/i)) {
      return callback();
    }

   return callback();
  });

};

function fixObjectId(item) {
  return item.$oid || item;
}

function fixUserObjectId(item) {
  if (!item.userId) return item;

  item.userId = item.userId.$oid || item.userId;
  return item;
}

/*
 * Loading fixture JSONs.
 */

// This array gives the order for reading the fixtures
var fixtureFiles = [
 'Identity.json'
];

var fixtureName = null;
var fixtureFile = null;
var fixtureAux = {};

fixtureFiles.forEach(function(file) {
  fixtureName = file.slice(0, -5);
  fixtureFile = require(__dirname + '/' + config.get('test.fixtures_folder') + file);

  // Saving each fixture within a file
  fixtureFile.forEach(function(fixture) {
    fixtureAux[fixtureName] = fixture;
    fixtures.push(fixtureAux);

    // Cleaning object for next fixture
    fixtureAux = {};
  });

  // Cleaning objects, maybe not needed, but better for after the last iteration
  fixtureName = null;
  fixtureFile = null;
});

/**
 * Main part of the script:
 *  - Exports the function, or
 *  - Executes the function if running from CLI
 */
var runLoadFixtures = module.exports = function(callback) {
  async.series([
    function drop(done) {
      log.info('Dropping database...');
      mongoose.connection.db.dropDatabase();
      return done();
    },

    function loadFixtures(done) {
      log.info('Loading fixtures...');
      async.each(fixtures, addFixture, done);
    }

  ], callback);
};

if (!module.parent) {  // Run as CLI command exec

  async.series([
    function connect(done) {
      log.info('Connecting...');
      mongoose.connect(config.get('db.conn'), done);
    },

    function load(done) {
      runLoadFixtures(done);
    },

    function disconnect(done) {
      log.info('Disconnecting...');
      mongoose.disconnect(done);
    }

  ], function(err) {
    if (err) {
      log.error(err);
      process.exit(1);
    }

    log.info('Fixtures loaded');
    process.exit();
  });

}
