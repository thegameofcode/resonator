/*
* This file must be required in every test file before running any of the test scenarios.
* In this manner, the database connection can be established once BEFORE running any tests.
* Similarly, the database connection can be closed AFTER running all the tests.
*/
'use strict';
const config = require('config');
const mongoose = require('mongoose');
const async = require('async');

before(function(done) {
  mongoose.connect(config.get('db.conn'), function(error) {
    if (error) console.error('Error while connecting:\n%\n', error);
    done(error);
  });
});

after(function(callback) {
  async.series([

    function dropData(done) {
      mongoose.connection.db.dropDatabase(done);
    },

    function disconnect(done) {
      mongoose.disconnect(done);
    }

  ], callback);
});
