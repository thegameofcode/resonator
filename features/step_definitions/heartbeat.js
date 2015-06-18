var should = require('chai').should();
var request = require('request');
var world = require(process.cwd() + '/features/support/world.js');

module.exports = function(){
	this.When(/^a call is done to the hearbeat endpoint$/, function (callback) {
		var options = {
			url: "http://localhost:3000/heartbeat"
		};
		request(options, function(err, res, body){
			should.not.exist(err);
			world.res = res;
			if(body) {
				world.body = JSON.parse(body);
			}
			callback();
		});
	});

};