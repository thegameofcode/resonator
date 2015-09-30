require('./../global_conf');

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var async = require('async');

var Singleton = require('./../singleton');
var loadFixtures = require('./../../scripts/load_fixtures');

var apnTransport;
var apnConnection;

var apnMock = {};
var noop = function() {};

// Spy objects
var logSpy = {
  info: '',
  error: ''
};

var pushSpy = {
  deleteApnDevices: ''
};

describe('APN Transport: ', function() {

  before(function(done) {
    apnMock.Connection = Singleton.connectionSingleton;
    apnMock.Feedback = Singleton.feedbackSingleton;
    apnTransport = proxyquire('./../../lib/transport/apn', {
      'apn': apnMock,
      '../platforms/push': pushSpy,
      '../util/logger': logSpy
    });
    apnConnection = apnTransport.connect();
    return done();
  });

  beforeEach(function(done) {
    logSpy.info = sinon.spy();
    logSpy.error = sinon.spy();
    pushSpy.deleteApnDevices = sinon.spy();
    loadFixtures(done);
  });

  afterEach(function(done) {
    logSpy.info.reset();
    logSpy.error.reset();
    pushSpy.deleteApnDevices.reset();
    return done();
  });

  it('connects and the apnConnection emits a COMPLETED event', function(done) {

    async.series({
      setup: function(done) {
        apnConnection.shutdown = sinon.spy();
        apnConnection.emit('completed');
        return done();
      },
      assertions: function(done) {
        expect(logSpy.info.calledOnce).to.equal(true);
        expect(logSpy.info.calledWithExactly('APN completed')).to.equal(true);
        expect(apnConnection.shutdown.calledOnce).to.equal(true);
        apnConnection.shutdown.reset();
        return done();
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects and the apnConnection emits a CONNECTED event', function(done) {

    var eventArg = 'someSocket';

    async.series({
      setup: function(done) {
        apnConnection.shutdown = noop;
        apnConnection.emit('connected', eventArg);
        return done();
      },
      assertions: function(done) {
        expect(logSpy.info.calledOnce).to.equal(true);
        expect(logSpy.info.calledWithExactly('APN connected openSockets[' + eventArg + ']'));
        return done();
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects and the apnConnection emits a TIMEOUT event', function(done) {

    async.series({
      setup: function(done) {
        apnConnection.emit('timeout');
        return done();
      },
      assertions: function(done) {
        expect(logSpy.info.calledOnce).to.equal(true);
        expect(logSpy.info.calledWithExactly('APN timeout'));
        return done();
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects and the apnConnection emits a TRANSMITTED event', function(done) {

    var deviceArg = '[Some device]';
    var notificationArg = {
      notification: 'Notification text'
    };

    async.series({
      setup: function(done) {
        apnConnection.emit('transmitted', deviceArg, notificationArg);
        return done();
      },
      assertions: function(done) {
        expect(logSpy.info.calledOnce).to.equal(true);
        expect(logSpy.info.calledWithExactly('APN transmitted device[' + deviceArg + '] compiledPayload[' + notificationArg.compiledPayload + ']'));
        return done();
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects and the apnConnection emits a TRANSMISSIONERROR event', function(done) {
    var errorCodeArg = '400';
    var deviceArg = '[Some device]';
    var notificationArg = {
      notification: 'Notification text'
    };

    async.series({
      setup: function(done) {
        apnConnection.emit('transmissionError', errorCodeArg, notificationArg, deviceArg);
        return done();
      },
      assertions: function(done) {
        expect(logSpy.error.calledOnce).to.equal(true);
        return done();
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects and the FeedbackService emits a ERROR event', function(done) {

    var feedback = apnMock.Feedback();
    var errorArg = 'Error';

    async.series({
      setup: function(done) {
        feedback.emit('error', errorArg);
        return done();
      },
      assertions: function(done) {
        expect(logSpy.error.calledOnce).to.equal(true);
        expect(logSpy.error.calledWithExactly('Feedback conn error:', errorArg));
        return done();
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects and the FeedbackService emits a FEEDBACKERROR event', function(done) {

    var feedback = apnMock.Feedback();
    var errorArg = 'Feedback error';

    async.series({
      setup: function(done) {
        feedback.emit('feedbackError', errorArg);
        return done();
      },
      assertions: function(done) {
        expect(logSpy.error.calledOnce).to.equal(true);
        expect(logSpy.error.calledWithExactly('Feedback error:', errorArg));
        return done();
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects and the FeedbackService emits a FEEDBACK event', function(done) {

    var feedback = apnMock.Feedback();
    var feedbackData = [
      { device: { token: '<0123 4567 89AB CDEF>'} },
      { device: { token: '<0123 4567 89AB CDFF>'} }
    ];

    async.series({
      setup: function(done) {
        feedback.emit('feedback', feedbackData);
        return done();
      },
      assertions: function(done) {
        expect(logSpy.info.calledOnce).to.equal(true);
        expect(logSpy.info.calledWithExactly('Remove ' + feedbackData.length + ' devices'));
        expect(pushSpy.deleteApnDevices.calledOnce).to.equal(true);
        return done();
      }
    }, function(err) {
      if(err) {
        return done(err);
      }
      return done();
    });
  });

  it('connects again and returns the existing apnConnection object', function(done) {
    var connection = apnTransport.connect();
    expect(connection).to.deep.equal(apnConnection);
    return done();
  });

  it('pushes notifications', function(done) {

    apnMock.Connection().pushNotification = sinon.spy();
    apnMock.Device = sinon.spy();
    apnMock.Notification = function() {
      return {
        expiry: '',
        alert: '',
        payload: '',
        badge: '',
        sound: ''
      };
    };

    var deviceTokens = ['<0123 4567 89AB CDEF>', '<0123 4567 89AB CDFF>'];
    var alert = 'Some kind of alert';
    var data = 'Notification payload';

    async.series({
      setup: function(done) {
        apnTransport.pushNotification(apnConnection, deviceTokens, alert, data, function(error) {
          expect(error).to.equal(null);
          return done();
        });
      },
      assertions: function(done) {
        expect(apnMock.Device.calledTwice).to.equal(true);
        expect(apnMock.Connection().pushNotification.calledTwice).to.equal(true);
        return done();
      }
    }, function(err) {
      apnMock.Device.reset();
      apnMock.Connection().pushNotification.reset();
      if (err) {
        return done(err);
      }
      return done();
    });
  });

});

  //it('startApnConnection successfully', function(done) {
  //
  //  var deviceTokens = ["<0123 4567 89AB CDEF>"];
  //
  //  var alert = 'New iOS notification alert message';
  //  var data = {aps: 'Wolololo'};
  //
  //  apnTransport.pushNotification(deviceTokens, alert, data, function(error) {
  //    expect(error).to.equal(null);
  //    apnTransport.close();
  //    return done();
  //  });
  //});


