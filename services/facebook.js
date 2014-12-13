// Dependencies
var request = require('request');
var qs = require('querystring');

// Facebook Handle
function Facebook(app, options){
	var service = this;
	service.id = options.id;
	service.secret = options.secret;
	service.app = app;
	service.response = options.success ? options.success : app.domain + 'auth/facebook/response';
	service.dialog = options.dialog || '/auth/facebook';
	service.redirect = '/auth/facebook/redirect';
	service.redirect_uri = app.location.href+service.redirect.substr(1) ;
	
	service.scopes = options.scope ? '&scope='+options.scope : '' ;
	
	// 1. request dialog
	app.get(service.dialog, function($){
		$.redirect('https://www.facebook.com/dialog/oauth'
			+ '?client_id='+service.id
			+ '&redirect_uri='+service.redirect_uri+service.scopes);
	});
	
	// 2. after dialog
	app.get(service.redirect, function($){
		console.log('$.query.code',$.query.code)
		if($.query.code){
			
			// 3. get token
			service.access_token($.query.code, function(access_token_error, access_token_body){
				var access_token = qs.parse(access_token_body).access_token;
				console.log(access_token)
				if(access_token){
					request('https://graph.facebook.com/v2.0/me?access_token='+access_token, 
						function(error, http, me_body){
							$.error = error;
							if(me_body){
								$.data.user = JSON.parse(me_body);
								$.passed = true;
								$.data.tokens = qs.parse(access_token_body);
								$.return();
							} else {
								$.passed = false;
								if(!error) $.error = 'User not found.';
								$.return();
							}
						//$.redirect(service.response+'?passed=true&'+access_token_body+'&'+qs.stringify({user:me_body}));
					});
				} else {
					$.error = JSON.parse(access_token_body);
					$.passed = false;
					$.return();
					//$.redirect(service.response+'?passed=false&error='+JSON.stringify(error));
					
				}
			});
		} else if ($.query.token) {
			service.inspect_access_token(access_token, $.query.token, function(inspect_error, inspect_body){
				if(!inspect_error){
					$.passed = true;
					Object.merge($.data, qs.parse(inspect_body));
					$.return();
					//$.redirect(service.response+'?passed=true&'+inspect_body);
				} else {
					$.passed = false;
					$.error = qs.parse(inspect_error);
					$.return();
					//$.redirect(service.response+'?passed=false&'+inspect_error);
				}
			});
		} else if ($.query.error) {
			$.passed = false;
			$.error = $.query.error;
			$.return();
		}
	});
	
	return service;
}

Facebook.prototype.access_token = function(code, callback){
	request('https://graph.facebook.com/oauth/access_token?'
	   + 'client_id='+this.id
	   + '&redirect_uri='+this.redirect_uri
	   + '&client_secret='+this.secret
	   + '&code='+code, 
	function(error, httpResponse, body){
		callback(error, body);
	});
}

Facebook.prototype.inspect_access_token = function(access_token, callback){
	var service = this;
	request('https://graph.facebook.com/debug_token?'
	    + 'access_token='+access_token, 
	function(error, httpResponse, body){
		callback(error, body);
	});
}

module.exports = Facebook;