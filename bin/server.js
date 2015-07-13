var service = require('../lib/service');
var config = require('config');

var options = {
  port: process.env.PORT || config.get('port')
};

service(options).start(function(){
  console.log('Started server');
});