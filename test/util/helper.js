var helper = require('./../../lib/util/helper');
var expect = require('chai').expect;

var VALID_EMAIL = 'mac@into.sh';
var INVALID_EMAIL = 'bla@bla@bla.com';
var VALID_PHONE_NUMNER = '12345678912345';
var INVALID_PHONE_NUMBER = '001122334455667788';

describe('Helper: ', function() {

	it('verifies a VALID email', function(done) {
		var check = helper.isEmail(VALID_EMAIL);
		expect(check).to.equal(true);
		return done();
	});

	it('verifies an INVALID email', function(done) {
		var check = helper.isEmail(INVALID_EMAIL);
		expect(check).to.equal(false);
		return done();
	});

	it('verifies a VALID phone number', function(done) {

		var check = helper.isPhoneNumber(VALID_PHONE_NUMNER);
		expect(check).to.equal(true);
		return done();
	});

	it('verifies an INVALID phone number', function(done) {
		var check = helper.isPhoneNumber(INVALID_PHONE_NUMBER);
		expect(check).to.equal(false);
		return done();
	});
});