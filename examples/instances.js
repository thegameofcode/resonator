var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Singleton = function() {
  this.counter = 0;
  EventEmitter.call(this);
};

util.inherits(Singleton, EventEmitter);

var sin = new Singleton();

function sum() {
  this.counter +=1;
  console.log('count', this.counter);
}

var Conn = function(params) {
  return sin;
};



var c1 = new Conn();
var c2 = new Conn();
var c3 = new Conn();
c1.on('sum', sum);
c1.emit('sum');
//sin.on('sum', sum);
//c1.emit('sum');
//c2.emit('sum');
//c3.emit('sum');
//c3.emit('sum');
//
//sin.removeListener('sum', sum);
//c1.emit('sum');
//sin.on('sum', sum);
//c1.emit('sum');