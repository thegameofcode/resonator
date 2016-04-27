'use strict';
const generateFilenameWithExt = require('./../../lib/util/generate_filename_with_ext');
const expect = require('chai').expect;

const FILENAME_WITHOUT_EXTENSION = 'template';
const FILENAME_WITH_EXTENSION = 'template.html';

describe('Generate filename with extension: ', function() {

  it('should return the filename with the \'.html\' extension appended', function(done) {
    const outFilename = generateFilenameWithExt(FILENAME_WITHOUT_EXTENSION, 'html');
    expect(outFilename).to.equal(FILENAME_WITH_EXTENSION);
    return done();
  });

  it('should return the same filename without modifications', function(done) {
    const outFilename = generateFilenameWithExt(FILENAME_WITH_EXTENSION, '');
    expect(outFilename).to.equal(FILENAME_WITH_EXTENSION);
    return done();
  });
});
