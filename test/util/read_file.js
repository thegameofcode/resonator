'use strict';
const readFile = require('./../../lib/util/read_file');
const expect = require('chai').expect;
const path = require('path');

const VALID_HTML_PATH = path.join(__dirname, '../sample_files/template.html');
const INVALID_HTML_PATH = path.join(__dirname, '../sample_files/no-file.html');

describe('Read file: ', function() {

  it('reads the content of the template successfully', function(done) {
    const output = readFile(VALID_HTML_PATH);
    expect(output.html).to.not.equal(undefined);
    expect(output.error).to.equal(undefined);
    return done();
  });

  it('returns an error due to non-existing file or other error', function(done) {
    const output = readFile(INVALID_HTML_PATH);
    expect(output.html).to.equal(undefined);
    expect(output.error).to.have.property('message', 'HTML template not found');
    expect(output.error).to.have.property('statusCode', 404);
    expect(output.error).to.have.property('body');
    expect(output.error.body).to.have.property('code', 'NotFoundError');
    return done();
  });
});
