'use strict';
const sinon = require('sinon');
const expect = require('chai').expect;
const fs = require('fs');

const templatePlatform = require('./../../lib/platforms/template');
let fsStub = {};

const VALID_MJML = '<mj-body><mj-section><mj-column><mj-text>Hello World</mj-text></mj-column></mj-section></mj-body>';
const VALID_HTML = '<html><body><h1>Hello World</h1></body></html>';
const INVALID_MJML = '<mj-blablabla></mj-blablabla>';
const READ_FILE_LIST = ['template-1.mjml', 'template-2.mjml', 'template-3.mjml'];
const FILE_LIST = [{name: 'template-1', type: 'mjml'}, {name: 'template-2', type: 'mjml'}, {name: 'template-3', type: 'mjml'}];

describe('Template email', function() {

  beforeEach(function(done) {
    fsStub.writeFile = sinon.stub(fs, 'writeFile');
    fsStub.writeFile.yields(null);
    fsStub.readdir = sinon.stub(fs, 'readdir');
    fsStub.readdir.yields(null, READ_FILE_LIST);
    fsStub.readFileSync = sinon.stub(fs, 'readFileSync');
    return done();
  });

  afterEach(function(done) {
    fsStub.writeFile.restore();
    fsStub.readdir.restore();
    fsStub.readFileSync.restore();
    return done();
  });

  it('generates an HTML from an MJML', function(done) {

    const input = {
      filename: 'template',
      content: VALID_MJML,
      type: 'mjml'
    };

    templatePlatform .generateHtmlTemplate(input, function(err, output) {
      expect(err).to.equal(null);
      expect(output).to.deep.equal({ output: 'done'});
      return done();
    });
  });

  it('yields an error when generating an HTML from an MJML', function(done) {

    const input = {
      filename: 'template',
      content: INVALID_MJML,
      type: 'mjml'
    };

    templatePlatform .generateHtmlTemplate(input, function(err, output) {
      expect(output).to.equal(undefined);
      expect(err).to.have.property('message', '[MJMLError] EmptyMJMLError: Null element found in mjmlElementParser');
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('body');
      expect(err.body).to.have.property('code', 'BadRequestError');
      return done();
    });
  });

  it('yields an error when saving the HTML and MJML files', function(done) {

    const input = {
      filename: 'template',
      content: VALID_MJML,
      type: 'mjml'
    };

    const writeError = new Error('Write error');
    fs.writeFile.yields(writeError);

    templatePlatform .generateHtmlTemplate(input, function(err, output) {
      expect(output).to.equal(undefined);
      expect(err).to.deep.equal(writeError);
      return done();
    });
  });

  it('returns a list of HTML templates', function(done) {

    templatePlatform.getListOfHtmlTemplates(function(err, list) {
      expect(err).to.equal(null);
      expect(list).to.be.an('array');
      expect(list).to.deep.equal(FILE_LIST);
      return done();
    });
  });

  it('yields an error when failing to read the HTML templates directory', function(done) {

    const readError = new Error('Read error');
    fsStub.readdir.yields(readError);

    templatePlatform.getListOfHtmlTemplates(function(err, list) {
      expect(list).to.equal(undefined);
      expect(err).to.deep.equal(readError);
      return done();
    });
  });

  it('returns the details associated to an MJML template', function(done) {

    const templateName = 'template.mjml';

    fsStub.readFileSync.returns(VALID_MJML);

    templatePlatform.getTemplateDetails(templateName, function(err, details) {
      expect(err).to.equal(null);
      expect(details).to.have.property('content');
      expect(details.content).to.equal(VALID_MJML);
      expect(details).to.have.property('placeholders');
      expect(details.placeholders).to.deep.equal([]);
      return done();
    });
  });

  it('returns the details associated to an MJML template', function(done) {

    const templateName = 'template.mjml';

    fsStub.readFileSync.returns(VALID_HTML);

    templatePlatform.getTemplateDetails(templateName, function(err, details) {
      expect(err).to.equal(null);
      expect(details).to.have.property('content');
      expect(details.content).to.equal(VALID_HTML);
      expect(details).to.have.property('placeholders');
      expect(details.placeholders).to.deep.equal([]);
      return done();
    });
  });

  it('fails because of not found HTML template', function(done) {
    const templateName = 'no-file.mjml';

    fsStub.readFileSync.throws(new Error('Not Found'));

    templatePlatform.getTemplateDetails(templateName, function(err, details) {
      expect(details).to.equal(undefined);
      expect(err).to.have.property('message', 'Template not found');
      expect(err).to.have.property('statusCode', 404);
      expect(err).to.have.property('body');
      expect(err.body).to.have.property('code', 'NotFoundError');
      return done();
    });
  });

  it('fails because of missing extension in requested HTML template filename', function(done) {
    const templateName = 'invalid-format';

    templatePlatform.getTemplateDetails(templateName, function(err, details) {
      expect(details).to.equal(undefined);
      expect(err).to.have.property('message', 'Invalid template filename: must have the <basename>.<extension> format');
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('body');
      expect(err.body).to.have.property('code', 'BadRequestError');
      return done();
    });
  });
});
