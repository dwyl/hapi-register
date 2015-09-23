# hapi-register

[![Build Status](https://travis-ci.org/nelsonic/hapi-register.svg?branch=master)](https://travis-ci.org/nelsonic/hapi-register)
[![Code Climate](https://codeclimate.com/github/nelsonic/hapi-register/badges/gpa.svg)](https://codeclimate.com/github/nelsonic/hapi-register)
[![codecov.io](http://codecov.io/github/nelsonic/hapi-register/coverage.svg?branch=master)](http://codecov.io/github/nelsonic/hapi-register?branch=master)
[![Dependency Status](https://david-dm.org/nelsonic/hapi-register.svg)](https://david-dm.org/nelsonic/hapi-register)
[![devDependency Status](https://david-dm.org/nelsonic/hapi-register/dev-status.svg)](https://david-dm.org/nelsonic/hapi-register#info=devDependencies)

Simplify (*email*) registration for your Hapi.js based web Application or API

## Why?

*Many* people still prefer to use their email address when registering
to use an app or service - as opposed to logging in with their Google (or other) account.
This plugin/module helps *simplify* that process.

#### Why use a Plugin for something *this* Simple?

Simple answer is: We have tested it. Provide good examples and are committed
to maintaining it so you don't have to think about it.

Given that you have ***full control*** over what fields
are accepted/required and how the request gets handled,
there is *no downside*.

## What?

***Simple, Tested & Maintained*** email registration you
can add, configure and use in your Hapi.js app in *minutes*.


## How? (*Usage*)

### Install from NPM

First install the plugin from `npm` and save it as a *dependency*:

```sh
npm install hapi-register --save
```

### 1. Specify Your *Required* Fields

In your code, define the fields you want people to register with.

```js
var Joi = require('joi');
var custom_fields = {
  email     : Joi.string().email().required(),
  firstname : Joi.string(),
  password  : Joi.string().required().min(6) // min 6 characters
}
var opts = { fields: custom_fields };       // pass the options when registering the plugin
```

### 2. Define your handler function

Your handler function can be what ever you want it to be.

Imagine you are using Redis to store records of people who have registered to use your service:

```js
var Boom        = require('boom');
var redisClient = require('redis-connection')();
function custom_handler(request, reply){
  redisClient.get(request.payload.email, function (err, reply) {
    if(err) { // if not already registered, register the person:
      redisClient.set(request.payload.email, JSON.stringify(request.payload));
      return reply('Success')
    }
    else {
      return reply(Boom.badRequest('Already Registered'));
    }
  });
}
// include the custom_handler in your otps object:
opts.handler = custom_handler;
```
> More examples:

### Load the `hapi-register` plugin into your server

Load the plugin with the `options` object containing *fields* you need:

```js
var Hapi   = require('hapi'); https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });
server.register([{ register: require('hapi-register'), options:opts }], function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

server.start(function(){
  console.log('Now Visit: http://127.0.0.1:'+server.info.port);
});
```


## Examples


#### Mode 1 - Require *Just Email* Address

If people *only* have to type in their email address to register their *interest* in using your app/site its the lowest possible friction.


#### Mode 2 - Require an *Email and Password*




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

The first allows people to enter (*just*) their
email address to stay *informed* of what we are doing. This is commonly
referred to as "*registering* ***interest***" in a product/service.

Second we *encourage* people to give us a bit more detail about themselves;
specifically their `first name` so that we can *address* them *by name*
when we contact them.

## Background Reading

+ ***Don’t Make Me Think*** - A Common Sense Approach to Web Usability -
*essential* reading for anyone building web sites/applications. see: http://www.sensible.com/dmmt.html
+ ***Rocket Surgery Made Easy*** - The Do-It-Yourself Guide to Finding and Fixing Usability Problems - *also recommended* when you need to
explain a usability issue to a non-technical person.
+ ***Time to Wow*** - a *detailed* explanation on why we should
*minimise* the "*friction*" to trying your product/service. see:
http://www.forentrepreneurs.com/time-to-wow/

Want to create your *own* Hapi Plugins?
read: http://hapijs.com/tutorials/plugins
