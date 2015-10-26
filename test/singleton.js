'use strict';
const EventEmitter = require('events').EventEmitter;
const util = require('util');

let Singleton = function() {
  EventEmitter.call(this);
};

util.inherits(Singleton, EventEmitter);

let connectionSingleton = new Singleton();
let feedbackSingleton = new Singleton();

let connectionSingletonInstance = function() {
  return connectionSingleton;
};

let feedbackSingletonInstance = function() {
  return feedbackSingleton;
};


module.exports = {
  connectionSingleton: connectionSingletonInstance,
  feedbackSingleton: feedbackSingletonInstance
};
