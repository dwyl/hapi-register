# hapi-register

Simplifies (*email*) registration for your Hapi.js based Web Application/API

[![Build Status](https://travis-ci.org/dwyl/hapi-register.svg?branch=master)](https://travis-ci.org/dwyl/hapi-register)
[![Code Climate](https://codeclimate.com/github/dwyl/hapi-register/badges/gpa.svg)](https://codeclimate.com/github/dwyl/hapi-register)
[![codecov.io](http://codecov.io/github/dwyl/hapi-register/coverage.svg?branch=master)](http://codecov.io/github/dwyl/hapi-register?branch=master)
[![Dependency Status](https://david-dm.org/dwyl/hapi-register.svg)](https://david-dm.org/dwyl/hapi-register)
[![devDependency Status](https://david-dm.org/dwyl/hapi-register/dev-status.svg)](https://david-dm.org/dwyl/hapi-register#info=devDependencies)

[![HAPI 13.0.0](http://img.shields.io/badge/hapi-13.2.1-brightgreen.svg "Latest Hapi.js")](http://hapijs.com)
[![Node.js Version](https://img.shields.io/node/v/hapi-auth-jwt2.svg?style=flat "Node.js 0.12 & 4.0 and io.js latest all supported")](http://nodejs.org/download/)
[![npm](https://img.shields.io/npm/v/hapi-register.svg)](https://www.npmjs.com/package/hapi-register)
[![bitHound Score](https://www.bithound.io/github/dwyl/hapi-auth-jwt2/badges/score.svg)](https://www.bithound.io/github/dwyl/hapi-auth-jwt2)
[![HitCount](https://hitt.herokuapp.com/nelsonic/hapi-register.svg)](https://github.com/dwyl/hapi-register)
[![Join the chat at https://gitter.im/dwyl/chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dwyl/chat/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Why?

*Many* people still prefer to use their email address when registering
to use an app or service - as opposed to logging in with their Google (or other) account.
This plugin/module *simplifies* the process of registering.

#### Why use a Plugin for something *this* Simple?

Simple answer is: We have ***tested*** it. Provide good ***examples*** and are committed
to ***maintaining*** it (*our production apps use it*...) so you don't have to *think* about it.

Given that you have ***full control*** over what fields
are accepted/required and how the request gets handled,
there is *no downside*.

## What?

***Simple, Tested & Maintained*** email registration you
can add, configure and use in your Hapi.js app in *minutes*.


## How? (*Usage*)

### Install from NPM

First install the `hapi-register` plugin
(*and* [***Joi***](https://github.com/hapijs/joi))
from `npm` and save as a *dependency*:

```sh
npm install hapi-register joi --save
```

> Note: You will use
[**Joi**](https://github.com/nelsonic/learn-hapi#validation-with-joi)
to specify the fields you want to allow/require
for registration in your app/website.

### 1. Specify Your *Required* and *Optional* Fields

In your code, define the fields you want people to register with.

```js
var Joi = require('joi');
var custom_fields = {
  email     : Joi.string().email().required(), // Required
  firstname : Joi.string()                     // Optional field
}
var opts = { fields: custom_fields };       // set options when registering the plugin
```

### 2. Define your handler function

Your handler function can be what ever you want it to be.

Imagine you are using Redis to store records of people who have registered to use your service:

```js
var Boom        = require('boom');
var bcrypt      = require('bcrypt'); // see: https://github.com/nelsonic/bcrypt
var redisClient = require('redis-connection')();
function custom_handler(request, reply){
  redisClient.get(request.payload.email, function (err, reply) {
    if(err) { // error when if not already registered, register the person:
      bcrypt.genSalt(12, function(err, salt) {
        bcrypt.hash(req.payload.password, salt, function(err, hash) {
          request.payload.password = hash; // save the password's hash
          redisClient.set(request.payload.email, JSON.stringify(request.payload));
          return reply('Success')
        }); // end bcrypt.hash
      }); // end bcrypt.genSalt
    }
    else {
      return reply(Boom.badRequest('Already Registered'));
    }
  });
}
// include the custom_handler in your otps object:
opts.handler = custom_handler;
```

##### Custom Login Path
- `loginPath` - (*optional*) an optional login path String, defaults to `/login` but can assigned any valid path.

add it to your options object:

```js
var options = {
  fields: fields,
  handler: handler,
  loginPath: "/api/login"
}
```

> More examples: https://github.com/dwyl/hapi-register-example

**Note**: if you want to define a custom `failAction` handler,
simply add it to the options object as
`opts.fail_action_handler = fail_handler`
If you have *no idea* what a `failAction` handler is,
*don't worry neither did we*,
see: https://github.com/nelsonic/hapi-validation-question

### 3. Load the `hapi-register` plugin into your server

Load the plugin with the `options` object containing *fields* you need:

```js
var Hapi   = require('hapi'); https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });
server.register([{ register: require('hapi-register'), options:opts }], function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

server.start(function() {
  console.log('Now Visit: http://127.0.0.1:'+server.info.port);
});
```

Now a `/register` route is available in your app which
accepts a `POST` request with the fields you defined above.

### Are we *there* yet?

If all you were doing is building a basic "*alpha*"
registration form to register people's interest in a
*potential* product/service, yes, you can ship this!

But if you want to do something more interesting,
we have prepared a few examples.

## Examples

The tests for this plugin show simple examples
of both Register *interest* with *Just Email* Address - the ***lowest possible friction*** -
( [test/email-only.test.js](https://github.com/dwyl/hapi-register/blob/master/test/email-only.test.js) )
and a more *detailed* custom registration handler with more fields
( [test/custom-handler-method.test.js](https://github.com/dwyl/hapi-register/blob/master/test/custom-handler-method.test.js) )


For a ***fully functional*** example using the **hapi-register**
plugin to power a site's registration see:
[hapi-register-***example***](https://github.com/dwyl/hapi-register-example)

# tl;dr

## The Art & Science of Helping People Register

*Much* *usability* and *user experience* research has gone into making
the "*perfect*" registration form for websites/applications.
(*see* "***Background Reading***" *section below*)
While there is **no** ***one-size fits all*** **solution** to the task,
there are a few general principals we can learn from the success of others.

> :bulb: The ***first question*** we should ask is:
**what is the** ***minimum*** **information** we
***need*** from **people**? (*to minimize the "friction" of registering*)

![minimise-friction-to-addoption](https://cloud.githubusercontent.com/assets/194400/9978113/251295f6-5f19-11e5-8452-ffe9549e07bb.png)

*Most* ***inexperienced*** web/app builders follow the "*we* ***might need*** *it*" approach (*often requested by a client or "product owner"*)
and *require* ***way too much***
input from the person registering and then *wonder* why their "*conversion*"
rate is low. The *simpler* approach is to ask for the *bare minimum*
you *need* in order to help get people *started using* your project as
quickly and easily a *possible* (*you can always ask for more detail later, once the person has tried the app and seen the value in it*).

At [**dwyl**](https://github.com/dwyl) we have ***two modes*** for letting people register.

The **first** allows people to enter (*just*) their
email address to stay *informed* of what we are doing. This is commonly
referred to as "*registering* ***interest***" in a product/service.

**Second** we *encourage* people to give us a bit more detail about themselves;
specifically their `first name` so that we can *address* them *by name*
when we send them updates.

## Background Reading

+ ***Don’t Make Me Think*** - A Common Sense Approach to Web Usability -
*essential* reading for anyone building web sites/applications. see: http://www.sensible.com/dmmt.html
+ ***Rocket Surgery Made Easy*** - The Do-It-Yourself Guide to Finding and Fixing Usability Problems - *also recommended* when you need to
explain a usability issue to a non-technical person.
+ ***Time to Wow*** - a *detailed* explanation on why we should
*minimise* the "*friction*" to trying your product/service. see:
http://www.forentrepreneurs.com/time-to-wow/

Want to *modularise* your Hapi app with your
*own* Hapi Plugins? read: http://hapijs.com/tutorials/plugins
