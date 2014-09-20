module.exports.use = function(service, options){
	var service = require('./services/'+service);
	return new service(module.parent.app, options);
}
module.parent.return();