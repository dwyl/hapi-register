var test   = require('tape');
// we display the file (name) in each test name
var dir   = __dirname.split('/')[__dirname.split('/').length-1];
var file  = dir + __filename.replace(__dirname, '') + ' -> ';

/************************ SETUP HAPI SERVER ***************************/
var Hapi   = require('hapi');  // https://github.com/nelsonic/learn-hapi
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });

// define which fields we want to validate for
var Joi    = require('joi');
var fields = {
  email     : Joi.string().email().required(),
  password  : Joi.string().required().min(6) // minimum length 6 characters
}
var registerPath = "/api/register";

function handler (request, reply) {
  console.log(request.payload)
  reply('test passed');
}

var opts   = { fields:fields, handler:handler, registerPath: registerPath };

// load the plugin with custom registerPath and other options
server.register([{ register: require('../lib'), options:opts }], function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

/************************* TESTS ***************************/
var person = {
  "email" : 'dwyl.test+auth_basic' +Math.random()+'@gmail.com',
  "password":"EverythingIsAwesome"
}

test(file+"Successfully register with email and password to custom set path", function(t) {
  var options = {
    method: "POST",
    url: "/api/register",
    payload : person
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Register worked with email and password");
    server.stop(function(){ t.end() });
  });
});

test(file+"Custom path should successfuly handle GET requests as well", function(t) {
  var options = {
    method: "GET",
    url: "/api/register"
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "GET requests should have a 200 response status code");
    server.stop(function() { t.end() });
  });
});

test(file+"Default path should fail handling GET requests", function(t) {
  var options = {
    method: "GET",
    url: "/register"
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 404, "GET requests should have a 404 response status code to default path");
    server.stop(function() { t.end() });
  });
});

test(file+"Default path should fail handling POST requests", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload: person
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 404, "POST requests should have a 404 response status code to default path");
    server.stop(function() { t.end() });
  });
});
