'use strict';
const processHtmlTemplate = require('./../../lib/util/process_html_template');
const expect = require('chai').expect;
const sinon = require('sinon');
const fileHandler = require('../../lib/util/file_handler');
const EXISTING_HTML_TEMPLATE = 'template.html';
const NON_EXISTING_HTML_TEMPLATE = 'no-file.html';

let fileHandlerStub;
describe('Process HTML template: ', function() {

  it('returns HTML data with the placeholders replaced', function(done) {

    const input = {
      filename: EXISTING_HTML_TEMPLATE,
      placeholders: {
        'USER': 'Mr. Invent'
      }
    };

    fileHandlerStub = sinon.stub(fileHandler, 'readFile');
    fileHandlerStub.returns({content: '<html><body><h1>Hello {{USER}}!</h1></body></html>'});

    const processedHtml = processHtmlTemplate(input);
    expect(processedHtml).to.have.property('content');
    expect(processedHtml.content.indexOf(input.placeholders.USER)).to.not.equal(-1);
    expect(processedHtml).to.not.have.property('error');
    fileHandlerStub.restore();
    return done();
  });

  it('returns an error due to non existing filename', function(done) {

    const input = {
      filename: NON_EXISTING_HTML_TEMPLATE,
      placeholders: {
        'USER': 'Mr. Invent'
      }
    };

    const processedHtml = processHtmlTemplate(input);
    expect(processedHtml).to.not.have.property('content');
    expect(processedHtml).to.have.property('error');
    expect(processedHtml.error).to.have.property('message', 'HTML template not found');
    expect(processedHtml.error).to.have.property('statusCode', 404);
    expect(processedHtml.error).to.have.property('body');
    expect(processedHtml.error.body).to.have.property('code', 'NotFoundError');
    return done();
  });
});
