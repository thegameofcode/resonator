'use strict';

module.exports = function(){

	var service = require(process.cwd() + '/lib/service.js');

  this.World = require('./world.js').World;
  this.World.registerServer(service);

};