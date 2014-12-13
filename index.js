module.exports = function(app){
	return function(service, options){
		var Service = require('./services/'+service);
		return new Service(app, options);
	}
}