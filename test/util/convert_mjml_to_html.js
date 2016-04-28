'use strict';
const convertMjmlToHtml = require('./../../lib/util/convert_mjml_to_html');
const expect = require('chai').expect;

const VALID_MJML = '<mj-body><mj-section><mj-column><mj-text>Hello World</mj-text></mj-column></mj-section></mj-body>';
const INVALID_MJML = '<mj-blablabla></mj-blablabla>';

describe('Convert MJML to HTML: ', function() {

  it('converts an input MJML file to an HTML equivalent', function(done) {

    const input = VALID_MJML;

    const htmlOutput = convertMjmlToHtml(input);
    expect(htmlOutput).to.not.have.property('error');
    expect(htmlOutput).to.have.property('html');
    expect(htmlOutput.html).to.not.equal(undefined);
    return done();
  });

  it('converts an input MJML file to an HTML equivalent', function(done) {

    const input = INVALID_MJML;

    const htmlOutput = convertMjmlToHtml(input);
    expect(htmlOutput).to.not.have.property('html');
    expect(htmlOutput).to.have.property('error');
    expect(htmlOutput.error).to.have.property('message', '[MJMLError] EmptyMJMLError: Null element found in mjmlElementParser');
    expect(htmlOutput.error).to.have.property('statusCode', 400);
    expect(htmlOutput.error).to.have.property('body');
    expect(htmlOutput.error.body).to.have.property('code', 'BadRequestError');
    return done();
  });
});
