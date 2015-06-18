module.exports = function(server){
	server.post('/notification/sms', function(req,res,next){
		sms.send(req.body.phone, req.body.text, function(err) {
			if(err){
				res.send(500, err);
			} else {
				res.send(204);
			}
			return next(false);
		});
	});
};