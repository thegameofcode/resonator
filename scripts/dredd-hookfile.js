var hooks = require('hooks');
var config = require('config');
var mongoose = require('mongoose');

var log = require('../lib/util/logger');

// hide logs on dredd output
log.level('fatal');

var loadFixtures = require('../scripts/load_fixtures');

hooks.beforeAll(function(transaction, done) {
    mongoose.connect(config.get('db.conn'), done);
});

hooks.beforeEach(function(transaction, done) {
    loadFixtures(done);
});

hooks.afterAll(function(transaction, done) {
    mongoose.disconnect(done);
});

