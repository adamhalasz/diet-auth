# **diet-auth**
Dead-simple authentication for [diet.js][1].

## **Install**
```
npm install diet-auth
```

## **Supported Services**
| Service | Protocol | Scope List
|:--------|:--------|:--------|
| facebook | OAuth 2.0 | https://developers.facebook.com/docs/facebook-login/permissions/v2.1
| google | OAuth 2.0 | https://developers.google.com/+/api/oauth
*More services are coming soon.*

## **Example Facebook Authentication**

```js
// index.js
require('diet');
var app = module.app = new App();
app.domain('http://localhost:8000/');
app.auth = app.plugin('diet-auth');
app.start();
```
```js
// auth.js
var app = module.parent.app;

// Setup Auth Service
var facebook = app.auth.use('facebook', {
	id		: 'yourId',             // facebook app id
	secret	: 'yourSecret',         // facebook app secret
	scope	: 'email'               // specify facebook scopes
});

// Listen on GET /auth/facebook/redirect
app.get(facebook.redirect, function($){
    $($.passed){
        $.end('Hello' + $.data.user.first_name + '!');
    } else {
        $.end('Something went wrong: ' + $.error);
    }
});
```

 - Visiting `http://localhost:8000/auth/facebook` will bring up the facebook login page.
 - After the user agreed or declined access to the application it will be redirected to your Redirect URL that is held in `facebook.redirect`
 - if `$.passed` is `true` then you'll have access to the `$.data.user` object that contains every profile information that you requested with the scope.
 - If `$.passed` is `false` then you can see what's wrong in the `$.error` method.


## **API**
`diet-auth` has a generalised api for all services. The only differences between services is the scope names and the `$.data.user` object.

```js
// auth.js
var app = module.parent.app;
var auth = app.plugin('diet-auth');

// Setup Auth Service 
var yourService = auth.use('yourService', {
	id		: 'yourServiceId',             // service app id
	secret	: 'yourServiceSecret',         // service app secret
	scope	: 'email'                      // specify facebook scopes
});

// Listen on GET /auth/yourService/redirect
app.get(yourService.redirect, function($){
    $($.passed){
        $.end('Hello' + $.data.user.first_name + '!');
    } else {
        $.end('Something went wrong: ' + $.error);
    }
});
```

## **Upcoming Features:**
- Better API documentation
- Twitter authorization
- Linkedin authorization
- Github authorization
- Windows Live authorization
- Yahoo authorization
- Trello authorization
 
  [1]: http://dietjs.com/
  