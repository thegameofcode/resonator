require('./../global_conf');

var expect = require('chai').expect;
var sinon = require('sinon');

var gcmTransport = require('./../../lib/transport/gcm');
var gcm = require('node-gcm');

var loadFixtures = require('./../../scripts/load_fixtures');
var log = require('./../../lib/util/logger');

/* Sinon stubs */
var gcmMessageStub, gcmSenderStub;
var TEST_FILES = './../sample_files/';

describe.only('GcmTransport: ', function() {

  beforeEach(function(done) {
    gcmSenderStub = sinon.spy(gcm.Sender, 'send');
    //gcmSenderStub = sinon.spy(gcm.Sender);
    loadFixtures(done);
  });

  afterEach(function(done) {
    gcmSenderStub.restore();
    return done();
  });

  it('sendGCM successfully', function(done) {

    var regIds = ['654C4DB3-3F68-4969-8ED2-80EA16B46EB0'];
    var data = { key: 'message' };
    var options = null;

    gcmTransport.sendGCM(regIds, data, options, function(error, result) {
      console.log('Test: ', error, result);
      gcmSenderStub.send.called.should.equal(true);
      return done();
    });
  });

  it('sendGCM with errors', function(done) {
    return done();
  });
});
