require('./../global_conf');

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var loadFixtures = require('./../../scripts/load_fixtures');
var mailgunTransport;
var requestMock = {};

var logSpy = {
	info: '',
	error: ''
};

describe('Mailgun Transport: ', function() {

	before(function(done) {

		requestMock = function(options, callback) {
			return callback(null, 'done');
		};

		mailgunTransport = proxyquire('./../../lib/transport/mailgun', {
			'request': requestMock,
			'../util/logger': logSpy
		});
		return done();
	});

	beforeEach(function(done) {
		logSpy.info = sinon.spy();
		logSpy.error = sinon.spy();
		loadFixtures(done);
	});

	afterEach(function(done) {
		logSpy.info.reset();
		logSpy.error.reset();
		return done();
	});

	it('sends emails via Mailgun', function(done) {

		var emails = ['first@target.com', 'second@target.com', 'third@target.com'];
		var emailBody = {
			from: 'origin@target.com',
			subject: 'Test subject',
			message: 'This is a sample text to act as a message for this email test.'
		};

		mailgunTransport.send(emails, emailBody, function(error, result) {
			expect(error).to.equal(null);
			expect(result).to.equal('done');
			return done();
		});
	});
});