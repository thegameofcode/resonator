'use strict';
const config = require('config');
const nock = require('nock');
const sinon = require('sinon');
const fileHandler = require('../../../lib/util/file_handler');
const errors = require('../../../lib/util/errors');

let fileHandlerStub;
nock.disableNetConnect();


const MAILGUN_MESSAGES_BASE_URL = 'https://api.mailgun.net';
const MAILGUN_MESSAGES_ENDPOINT_URL = '/v3/' + config.get('transport.mailgun.domain') + '/messages';

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^a request is sent to (.*) to send an email (.*) and returns (.*)$/, function(endpoint, email, response, callback) {
    let _this = this;

    let emailObj = _this.readJSONResource(email);
    let res = _this.readJSONResource(response);

    nock(MAILGUN_MESSAGES_BASE_URL)
      .persist() // Required since multiple requests can be made in parallel from the platform
      .post(MAILGUN_MESSAGES_ENDPOINT_URL)
      .reply(200, res.data);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(emailObj)
      .expect(res.status)
      .end(callback);
  });

  this.Then(/^a request is sent to (.*) to send a custom email template (.*) for (.*) and returns (.*)$/, function(endpoint, templateFile, email, response, callback) {
    let _this = this;

    let template = _this.readJSONResource(templateFile);
    let emailObj = _this.readJSONResource(email);
    let res = _this.readJSONResource(response);
    fileHandlerStub = sinon.stub(fileHandler, 'readFile');

    if (template.success) {
      fileHandlerStub.returns(template.success);
    } else {
      fileHandlerStub.returns({error: new errors.NotFoundError(template.error.message)});
    }

    nock(MAILGUN_MESSAGES_BASE_URL)
      .persist() // Required since multiple requests can be made in parallel from the platform
      .post(MAILGUN_MESSAGES_ENDPOINT_URL)
      .reply(200, res.data);

    let request = this.buildRequest('POST', endpoint, {
      'x-user-id': this.get('identity')
    });

    request
      .send(emailObj)
      .expect(res.status)
      .end(function(err) {
        fileHandlerStub.restore();
        if (err) {
          return callback(err);
        }

        return callback();
      });
  });
};
