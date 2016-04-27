'use strict';
const fileHandler = require('./../../lib/util/file_handler');
const expect = require('chai').expect;
const path = require('path');

const VALID_HTML_PATH = path.join(__dirname, '../sample_files/template.html');
const INVALID_HTML_PATH = path.join(__dirname, '../sample_files/no-file.html');

describe('Read file: ', function() {

  it('reads the content of the template successfully', function(done) {
    const output = fileHandler.readFile(VALID_HTML_PATH);
    expect(output.content).to.not.equal(undefined);
    expect(output.error).to.equal(undefined);
    return done();
  });

  it('returns an error due to non-existing file or other error', function(done) {
    const output = fileHandler.readFile(INVALID_HTML_PATH);
    expect(output.content).to.equal(undefined);
    expect(output.error).to.have.property('message', 'HTML template not found');
    expect(output.error).to.have.property('statusCode', 404);
    expect(output.error).to.have.property('body');
    expect(output.error.body).to.have.property('code', 'NotFoundError');
    return done();
  });
});
