'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const templatePlatform = require('../../../lib/platforms/template');

let templatePlatformStub = {};

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a template object (.*) is sent to (.*) yielding (.*)/, function(requestBody, endpoint, response, callback) {
    let _this = this;

    let requestBodyObj = _this.readJSONResource(requestBody);
    let res = _this.readJSONResource(response);

    templatePlatformStub.generateHtmlTemplate = sinon.stub(templatePlatform, 'generateHtmlTemplate');
    templatePlatformStub.generateHtmlTemplate.yields(res.stubbed.error, res.stubbed.output);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(requestBodyObj)
      .expect(res.result.status)
      .end(function(err, output) {
        templatePlatformStub.generateHtmlTemplate.restore();
        if (err) {
          return callback(err);
        }

        expect(output.body).to.deep.equal(res.result.body);
        return callback();
      });
  });

  this.Then(/^a request for template listing is sent to (.*) yielding (.*)$/, function(endpoint, response, callback) {
    let _this = this;

    let res = _this.readJSONResource(response);

    templatePlatformStub.getListOfHtmlTemplates = sinon.stub(templatePlatform, 'getListOfHtmlTemplates');
    templatePlatformStub.getListOfHtmlTemplates.yields(res.stubbed.error, res.stubbed.output);

    let request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send()
      .expect(res.result.status)
      .end(function(err, output) {
        templatePlatformStub.getListOfHtmlTemplates.restore();
        if (err) {
          return callback(err);
        }

        expect(output.body).to.deep.equal(res.result.body);
        return callback();
      });
  });

  this.Then(/^a request for template details is sent to (.*) yielding (.*)$/, function(endpoint, response, callback) {
    let _this = this;

    let res = _this.readJSONResource(response);

    templatePlatformStub.getTemplateDetails = sinon.stub(templatePlatform, 'getTemplateDetails');
    templatePlatformStub.getTemplateDetails.yields(res.stubbed.error, res.stubbed.output);

    let request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send()
      .expect(res.result.status)
      .end(function(err, output) {
        templatePlatformStub.getTemplateDetails.restore();
        if (err) {
          return callback(err);
        }

        expect(output.body).to.deep.equal(res.result.body);
        return callback();
      });
  });
};
