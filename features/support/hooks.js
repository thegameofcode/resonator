'use strict';

module.exports = function(){
	var options = {
		port:3000
	};
	var service = require(process.cwd() + '/lib/service.js')(options);

	this.registerHandler('BeforeFeatures', function(evt, done){
		service.start(done);
	});

	this.registerHandler('AfterFeatures', function(evt, done){
		service.stop(done);
	});

};