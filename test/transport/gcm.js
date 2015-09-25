require('./../global_conf');

var expect = require('chai').expect;
var proxyquire = require('proxyquire');

var gcmTransport = require('./../../lib/transport/gcm');

var loadFixtures = require('./../../scripts/load_fixtures');
var gcmMock;

/* Mocking */
var gcmSend = function(message, registrationIds, number, callback) {
  return callback(null, true);
};

var gcmSendWithErrors = function(message, registrationIds, number, callback) {
  return callback(true, null);
};

describe('GcmTransport: ', function() {

  beforeEach(function(done) {
    gcmMock = proxyquire('node-gcm', {});
    gcmMock.Sender = function() { };
    gcmMock.Message = function() {};
    gcmMock.Message.prototype.addData = function() {};
    loadFixtures(done);
  });

  it('sendGCM successfully', function(done) {

    gcmMock.Sender.prototype.send = gcmSend;

    var regIds = ['654C4DB3-3F68-4969-8ED2-80EA16B46EB0'];
    var data = { key: 'message' };
    var options = null;

    gcmTransport.sendGCM(regIds, data, options, function(error, result) {
      expect(error).to.equal(null);
      expect(result).to.equal(true);
      return done();
    });
  });

  it('sendGCM with errors', function(done) {

    gcmMock.Sender.prototype.send = gcmSendWithErrors;

    var regIds = ['654C4DB3-3F68-4969-8ED2-80EA16B46EB0'];
    var data = { key: 'message' };
    var options = null;

    gcmTransport.sendGCM(regIds, data, options, function(error, result) {
      expect(error).to.equal(true);
      expect(result).to.equal(null);
      return done();
    });
  });
});
