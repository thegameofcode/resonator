'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const templatePlatform = require('../../../lib/platforms/template');

let templatePlatformStub = {};

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a template object (.*) is sent to (.*) and creates template successfully with (.*)/, function(requestBody, endpoint, response, callback) {
    let _this = this;

    let requestBodyObj = _this.readJSONResource(requestBody);
    let res = _this.readJSONResource(response);

    templatePlatformStub.generateHtmlTemplate = sinon.stub(templatePlatform, 'generateHtmlTemplate');
    templatePlatformStub.generateHtmlTemplate.yields(res.data.error, res.data.content);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(requestBodyObj)
      .expect(res.status)
      .end(function(err) {
        templatePlatformStub.generateHtmlTemplate.restore();
        if (err) {
          return callback(err);
        }

        return callback();
      });
  });

  this.Then(/^a template object (.*) is sent to (.*) and returns error with (.*)/, function(requestBody, endpoint, response, callback) {

    let _this = this;

    let requestBodyObj = _this.readJSONResource(requestBody);
    let res = _this.readJSONResource(response);

    templatePlatformStub.generateHtmlTemplate = sinon.stub(templatePlatform, 'generateHtmlTemplate');
    templatePlatformStub.generateHtmlTemplate.yields(res.data.error, res.data.content);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(requestBodyObj)
      .expect(res.status)
      .end(function(err) {
        if (err) {
          return callback(err);
        }
        templatePlatformStub.generateHtmlTemplate.restore();

        return callback();
      });
  });

  this.Then(/^a request for template listing is sent to (.*) yielding the list of templates in (.*)$/, function(endpoint, response, callback) {
    let _this = this;

    let res = _this.readJSONResource(response);

    templatePlatformStub.getListOfHtmlTemplates = sinon.stub(templatePlatform, 'getListOfHtmlTemplates');
    templatePlatformStub.getListOfHtmlTemplates.yields(res.data.error, res.data.content);

    let request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send()
      .expect(res.status)
      .end(function(err, output) {
        templatePlatformStub.getListOfHtmlTemplates.restore();
        if (err) {
          return callback(err);
        }

        expect(output.body).to.have.length(res.data.content.length);
        return callback();
      });
  });

  this.Then(/^a request for template listing is sent to (.*) and fails yielding the error in (.*)$/, function(endpoint, response, callback) {
    let _this = this;

    let res = _this.readJSONResource(response);

    templatePlatformStub.getListOfHtmlTemplates = sinon.stub(templatePlatform, 'getListOfHtmlTemplates');
    templatePlatformStub.getListOfHtmlTemplates.yields(res.data.error, res.data.content);

    let request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send()
      .expect(res.status)
      .end(function(err, output) {
        templatePlatformStub.getListOfHtmlTemplates.restore();
        if (err) {
          return callback(err);
        }

        expect(output.body).to.deep.equal(res.data.error);
        return callback();
      });
  });

  this.Then(/^a request for template details is sent to (.*) yielding the template in (.*)$/, function(endpoint, response, callback) {
    let _this = this;

    let res = _this.readJSONResource(response);

    templatePlatformStub.getTemplateDetails = sinon.stub(templatePlatform, 'getTemplateDetails');
    templatePlatformStub.getTemplateDetails.yields(res.data.error, res.data.content);

    let request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send()
      .expect(res.status)
      .end(function(err, output) {
        templatePlatformStub.getTemplateDetails.restore();
        if (err) {
          return callback(err);
        }

        expect(output.body).to.deep.equal(res.data.content);
        return callback();
      });
  });

  this.Then(/^a request for template details is sent to (.*) and fails yielding the error in (.*)$/, function(endpoint, response, callback) {
    let _this = this;

    let res = _this.readJSONResource(response);

    templatePlatformStub.getTemplateDetails = sinon.stub(templatePlatform, 'getTemplateDetails');
    templatePlatformStub.getTemplateDetails.yields(res.data.error, res.data.content);

    let request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send()
      .expect(res.status)
      .end(function(err, output) {
        templatePlatformStub.getTemplateDetails.restore();
        if (err) {
          return callback(err);
        }

        expect(output.body).to.deep.equal(res.data.error);
        return callback();
      });
  });
};
