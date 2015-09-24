var test   = require('tape');
// we display the file (name) in each test name
var dir   = __dirname.split('/')[__dirname.split('/').length-1];
var file  = dir + __filename.replace(__dirname, '') + ' -> ';

/************************ SETUP HAPI SERVER ***************************/
var Hapi   = require('hapi');  // https://github.com/nelsonic/learn-hapi
var Boom   = require('boom'); // error handling https://github.com/hapijs/boom
var server = new Hapi.Server({ debug: false })
server.connection({ port: 8000 });

// define which fields we want to validate for
var Joi    = require('joi');
var custom_fields = {
  email     : Joi.string().email().required(),
  password  : Joi.string().required().min(6), // minimum length 6 characters
  firstname : Joi.string(),
  lastname  : Joi.string()
}
// custom route handler method
var level = require('level');
var db = level(__dirname + '/db');
function custom_handler (request, reply) {
  // check if a key exists, else import word list:
  db.get(request.payload.email, function (err, value) {
    // console.log(' - - - - - - - - - - - - - - - - - - ')
    // console.log(err, value)
    // console.log(' - - - - - - - - - - - - - - - - - - ')
    if (err) {
      db.put(request.payload.email, JSON.stringify(request.payload), function(err){
        // console.log(err);
      });
    }
    if(value) { // means the person has already registered!
      return reply(Boom.badRequest('Already Registered'))
    }
    else { // register the person
      return reply('Great Success!');
    }
  });
}
// both a custom handler and fields
var opts = {handler:custom_handler, fields:custom_fields};

// load the plugin with the specific fields we want to validate against
server.register([{ register: require('../lib'), options:opts }], function (err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

/************************* TESTS ***************************/
test(file+'Attempt to submit a registration without password', function(t){
  var options = {
    method: "POST",
    url: "/register",
    payload : { email:'this@here.net' }
  };

  server.inject(options, function(response) {
    // console.log(response)
    var code = response.statusCode
    t.equal(code, 400, 'Register without password fails -> '+code);
    server.stop(function(){ t.end() });
  });
})

test(file+'Attempt to register with unrecognised field', function(t){
  var options = {
    method: "POST",
    url: "/register",
    payload : { email:'this@here.net', password: 'pass4567', name:'Emit' }
  };

  server.inject(options, function(response) {
    // console.log(response)
    var code = response.statusCode
    t.equal(code, 400, 'Register with unknown field fails -> '+code);
    server.stop(function(){ t.end() });
  });
})

var person = {
  "email" : 'dwyl.test+auth_basic' +Math.random()+'@gmail.com',
  "password":"EverythingIsAwesome"
}

test(file+"Successfully register with email and password", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : person
  };

  server.inject(options, function(response) {
    // console.log(response)
    t.equal(response.statusCode, 200, "Register worked with email and password");
    server.stop(function(){ t.end() });
  });
});

test(file+"Attempt to re-register with the same email address", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : person
  };

  server.inject(options, function(response) {
    // console.log(response)
    t.equal(response.statusCode, 400, "Register worked with email and password");
    server.stop(function(){ t.end() });
  });
});
