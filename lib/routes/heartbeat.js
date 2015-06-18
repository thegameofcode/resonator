module.exports = function(server){
	server.get('/heartbeat', function(req,res,next){
		res.send(204);
		next();
	});
};