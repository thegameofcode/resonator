'use strict';
const sanitizePlaceholders = require('./../../lib/util/sanitize_placeholders');
const expect = require('chai').expect;

describe('Sanitize placeholders: ', function() {

  it('returns an array of strings with {{ and }} removed', function(done) {

    const placeholders = ['{{USER}}', '{{SUBJECT}}'];
    const sanitizedPlaceholders = sanitizePlaceholders(placeholders, ['{{', '}}']);
    expect(sanitizedPlaceholders).to.deep.equal(['USER', 'SUBJECT']);
    return done();
  });

  it('returns the same placeholders whe no sanitization characters are specified', function(done) {
    const placeholders = ['{{USER}}', '{{SUBJECT}}'];
    const sanitizedPlaceholders = sanitizePlaceholders(placeholders);
    expect(sanitizedPlaceholders).to.deep.equal(placeholders);
    return done();
  });

  it('returns an empty array when no placeholders are passed', function(done) {
    const sanitizedPlaceholders = sanitizePlaceholders(undefined, ['{{', '}}']);
    expect(sanitizedPlaceholders).to.deep.equal([]);
    return done();
  });
});
