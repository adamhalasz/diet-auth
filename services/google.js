// Dependencies
var request = require('request');
var qs = require('querystring');
var url = require('url');

// Google Handle
function Google(app, options, args){
	
	// Dependencies
	var google = require('googleapis');
	var plus = google.plus('v1');
	var OAuth2 = google.auth.OAuth2;
	
	var options = options || {};
	var service = this;
	service.dialog = options.dialog || '/auth/google';
	service.redirectPath = options.redirect ? options.redirect : app.domain+'auth/google/redirect';
	service.redirect = url.parse(service.redirectPath).pathname;
	service.oauth = new OAuth2(options.id, options.secret, service.redirectPath);
	service.response = options.response || '/auth/google/response';
	
	// generate a url that asks permissions for Google+ and Google Calendar scopes
	service.scopes = [];
	if(options.scope){
		options.scope.split(',').forEach(function(scope){
			service.scopes.push('https://www.googleapis.com/auth/'+scope.trim());
		});
	}
	
	service.url = service.oauth.generateAuthUrl({
	  access_type: options.access_type || 'offline', // 'online' (default) or 'offline' (gets refresh_token)
	  scope: service.scopes // If you only need one scope you can pass it as string
	});

	app.get(service.dialog, function($){
		$.redirect(service.url);
	});
	
	app.get(service.redirect, function($){
		service.oauth.getToken($.query.code, function(token_error, tokens) {
		  // Now tokens contains an access_token and an optional refresh_token. Save them.
			if(!token_error) {
				service.oauth.setCredentials(tokens);
				plus.people.get({ userId: 'me', auth:service.oauth }, function(profileError, response) {
					if(!profileError){
						$.data.user = response;
						$.passed = true;
						$.data.tokens = tokens;
						$.return();
					} else {
						$.passed = false;
						$.error = profileError;
						$.return();
					}
				});
			
			} else {
				$.passed = false;
				$.error = token_error;
				$.return();
			}
		});
	})
	/*

	var service = this;
	service.id = options.id;
	service.secret = options.secret;
	service.app = app;
	
	service.success = options.success ? options.success : app.domain + 'auth/google/success';
	service.failure = options.failure ? options.failure : app.domain + 'auth/google/failure';
	
	service.redirect = 'auth/google/redirect';
	service.redirect_uri = app.domain+service.redirect ;
	
	service.scopes = options.scope ? '&scope='+options.scope : '' ;
	
	// 1. request dialog
	app.get('/auth/Google', function($){
		
		$.redirect('https://www.Google.com/dialog/oauth'
			+ '?client_id='+service.id
			+ '&redirect_uri='+service.redirect_uri+service.scopes);
	});
	
	// 2. after dialog
	app.get('/'+service.redirect, function($){
		if($.query.code){
			// 3. get token
			service.access_token($.query.code, function(access_token_error, access_token_body){
				var access_token = qs.parse(access_token_body).access_token;
				
				if(access_token){
					request('https://graph.Google.com/v2.0/me?access_token='+access_token, 
					function(error, http, me_body){
						$.redirect(service.success+'?'+access_token_body+'&'+qs.stringify({user:me_body}));
					});
				} else {
					var error = JSON.parse(access_token_body).error;
					error.error = true;
					$.redirect(service.failure+'?error='+JSON.stringify(error));
					
				}
			});
		} else if ($.query.token) {
			service.inspect_access_token(access_token, $.query.token, function(inspect_error, inspect_body){
				if(!inspect_error){
					$.redirect(service.success+'?'+inspect_body);
				} else {
					$.redirect(service.failure+'?'+inspect_error);
				}
			});
		} else if ($.query.error) {
			$.redirect(service.failure+'?error='+JSON.stringify($.query.error));
		}
	});*/

	return service;
}

Google.prototype.access_token = function(code, callback){
	request('https://graph.Google.com/oauth/access_token?'
	   + 'client_id='+this.id
	   + '&redirect_uri='+this.redirect_uri
	   + '&client_secret='+this.secret
	   + '&code='+code, 
	function(error, httpResponse, body){
		callback(error, body);
	});
}

Google.prototype.inspect_access_token = function(access_token, callback){
	var service = this;
	request('https://graph.Google.com/debug_token?'
	    + 'access_token='+access_token, 
	function(error, httpResponse, body){
		callback(error, body);
		
	});
}

module.exports = Google;