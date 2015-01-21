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
var server = require('diet')
var app = server()
app.listen('http://localhost:8000/')
var auth  = require('diet-auth')(app)

// Setup Auth Service
var facebook = auth('facebook', {
	id		: 'yourId',             // facebook app id
	secret	: 'yourSecret',         // facebook app secret
	scope	: 'email'               // specify facebook scopes
})

// Listen on GET /auth/facebook/redirect
app.get(facebook.redirect, function($){
    $($.passed){
        $.end('Hello' + $.data.user.first_name + '!')
    } else {
        $.end('Something went wrong: ' + $.error)
    }
})
```

 - Visiting `http://localhost:8000/auth/facebook` will bring up the facebook login page.
 - After the user agreed or declined access to the application it will be redirected to your Redirect URL that is held in `facebook.redirect`
 - if `$.passed` is `true` then you'll have access to the `$.data.user` object that contains every profile information that you requested with the scope.
 - If `$.passed` is `false` then you can see what's wrong in the `$.error` method.


## **API**
`diet-auth` has a generalised api for all services. The only differences between services is the scope names and the `$.data.user` object.

```js
// Setup Auth Service 
var yourService = auth('yourService', {
	id		: 'yourServiceId',             // service app id
	secret	: 'yourServiceSecret',         // service app secret
	scope	: 'email'                      // specify facebook scopes
})

// Listen on GET /auth/yourService/redirect
app.get(yourService.redirect, function($){
    $($.passed){
        $.end('Hello' + $.data.user.first_name + '!')
    } else {
        $.end('Something went wrong: ' + $.error)
    }
})
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
  