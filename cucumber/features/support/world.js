var _ = require('lodash'),
  config = require('config'),
  qs = require('querystring'),
  test = require('supertest');

// or 'http://localhost:3005';
var server;

var World = function World(callback) {
  this.globals = [];
  return callback();
};

World.prototype.register = function(key, value) {
  this.globals[key] = value;
  return value;
};

World.prototype.get = function(key) {
  return this.globals[key];
};

World.prototype.clean = function() {
  this.globals = [];
};

World.prototype.buildQuerystring = function(url, params) {
  return url + (url.match(/\?/) ? '&' : '?') + qs.stringify(params);
};

World.prototype.buildRequest = function(method, endpoint, headers) {
  var request;

  method = method.toLowerCase();
  request = test(server)[method](endpoint);

  if (method === 'post') {
    request.type('application/json');
  }
  _.map(headers, function(val, headerName) {
    request.set(headerName, val);
  });

  request
    .set('Accept', 'application/json');

  return request;
};

World.prototype.toBool = function(str) {
  return (str === 'true');
};

World.prototype.readJSONResource = function(filename) {
  return require('../../' + config.get('test.resources_folder') + filename);
};

World.registerServer = function(module) {

  server = module;
};

World.prototype.readJSONResource = function(filename) {
  return require(process.cwd() + config.get('test.resources_folder') + filename);
};

module.exports.World = World;
