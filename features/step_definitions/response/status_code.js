require('chai').should();
var world = require(process.cwd() + '/features/support/world.js');

module.exports = function(){
	this.Then(/^the response status code is (\d+)$/, function (statusCode, callback) {
		world.should.have.property('res');
		world.res.statusCode.should.be.equal(Number(statusCode));
		callback();
	});
};