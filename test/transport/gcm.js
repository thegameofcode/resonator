'use strict';
require('./../global_conf');

const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const gcmTransport = require('./../../lib/transport/gcm');

const loadFixtures = require('./../../scripts/load_fixtures');
let gcmMock;

/* Mocking */
const gcmSend = function(message, registrationIds, number, callback) {
  return callback(null, true);
};

const gcmSendWithErrors = function(message, registrationIds, number, callback) {
  return callback(true, null);
};

describe('Gcm Transport: ', function() {

  beforeEach(function(done) {
    gcmMock = proxyquire('node-gcm', {});
    gcmMock.Sender = function() { };
    gcmMock.Message = function() {};
    gcmMock.Message.prototype.addData = function() {};
    loadFixtures(done);
  });

  it('sendGCM successfully', function(done) {

    gcmMock.Sender.prototype.send = gcmSend;

    const regIds = ['654C4DB3-3F68-4969-8ED2-80EA16B46EB0'];
    const data = { key: 'message' };
    let options = null;

    gcmTransport.sendGCM(regIds, data, options, function(error, result) {
      expect(error).to.equal(null);
      expect(result).to.equal(true);
      return done();
    });
  });

  it('sendGCM with errors', function(done) {

    gcmMock.Sender.prototype.send = gcmSendWithErrors;

    const regIds = ['654C4DB3-3F68-4969-8ED2-80EA16B46EB0'];
    const data = { key: 'message' };
    let options = null;

    gcmTransport.sendGCM(regIds, data, options, function(error, result) {
      expect(error).to.equal(true);
      expect(result).to.equal(null);
      return done();
    });
  });
});
