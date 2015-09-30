var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Singleton = function() {
  EventEmitter.call(this);
};

util.inherits(Singleton, EventEmitter);

var connectionSingleton = new Singleton();
var feedbackSingleton = new Singleton();

var connectionSingletonInstance = function() {
  return connectionSingleton;
};

var feedbackSingletonInstance = function() {
  return feedbackSingleton;
};


module.exports = {
  connectionSingleton: connectionSingletonInstance,
  feedbackSingleton: feedbackSingletonInstance
};