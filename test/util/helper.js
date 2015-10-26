'use strict';
const helper = require('./../../lib/util/helper');
const expect = require('chai').expect;

const VALID_EMAIL = 'mac@into.sh';
const INVALID_EMAIL = 'bla@bla@bla.com';
const VALID_PHONE_NUMNER = '12345678912345';
const INVALID_PHONE_NUMBER = '001122334455667788';

describe('Helper: ', function() {

  it('verifies a VALID email', function(done) {
    const check = helper.isEmail(VALID_EMAIL);
    expect(check).to.equal(true);
    return done();
  });

  it('verifies an INVALID email', function(done) {
    const check = helper.isEmail(INVALID_EMAIL);
    expect(check).to.equal(false);
    return done();
  });

  it('verifies a VALID phone number', function(done) {

    const check = helper.isPhoneNumber(VALID_PHONE_NUMNER);
    expect(check).to.equal(true);
    return done();
  });

  it('verifies an INVALID phone number', function(done) {
    const check = helper.isPhoneNumber(INVALID_PHONE_NUMBER);
    expect(check).to.equal(false);
    return done();
  });
});
